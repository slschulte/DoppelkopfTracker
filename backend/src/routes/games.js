import express from 'express';
import db from '../models/database.js';

const router = express.Router();

// Calculate points for a game based on official Doppelkopf rules
function calculatePoints(game) {
  const { points_re, points_kontra, extras, announcements, bock_round } = game;
  
  // Determine winner: Re needs 121, Kontra needs 120
  const reWon = points_re >= 121;
  const loserPoints = reWon ? points_kontra : points_re;
  
  // 1. Grundwert (Base value): 1 Punkt für das gewonnene Spiel
  let totalPoints = 1;
  
  // Parse announcements
  let announcementsObj = { re: false, kontra: false, keine90: false, keine60: false, keine30: false, keine0: false };
  if (announcements) {
    try {
      announcementsObj = typeof announcements === 'string' ? JSON.parse(announcements) : announcements;
    } catch (e) {
      // Use defaults
    }
  }
  
  // 2. Ansagen: +2 Punkte pro Re/Kontra Ansage
  if (announcementsObj.re) totalPoints += 2;
  if (announcementsObj.kontra) totalPoints += 2;
  
  // 3. Zusatzpunkte für erreichte Stufen (immer für Gewinner)
  // +1 Punkt für jede unterschrittene Schwelle des Verlierers
  if (loserPoints < 90) totalPoints += 1;  // keine 90
  if (loserPoints < 60) totalPoints += 1;  // keine 60
  if (loserPoints < 30) totalPoints += 1;  // keine 30
  if (loserPoints === 0) totalPoints += 1; // schwarz
  
  // 4. Zusätzliche Punkte für erfüllte Absagen
  // Diese werden NUR gezählt, wenn sie auch angesagt wurden
  if (announcementsObj.keine90 && loserPoints < 90) totalPoints += 1;
  if (announcementsObj.keine60 && loserPoints < 60) totalPoints += 1;
  if (announcementsObj.keine30 && loserPoints < 30) totalPoints += 1;
  if (announcementsObj.keine0 && loserPoints === 0) totalPoints += 1;
  
  // 5. Sonderpunkte (nur bei Normalspiel/Teamspiel)
  // Parse extras
  let extrasObj = {};
  if (extras) {
    try {
      extrasObj = typeof extras === 'string' ? JSON.parse(extras) : extras;
    } catch (e) {
      extrasObj = {};
    }
  }
  
  // +1 für jedes Extra (Karlchen, Doppelkopf, Fuchs, Gegen die Alten)
  if (extrasObj.karlchen) totalPoints += 1;
  if (extrasObj.doppelkopf) totalPoints += 1;
  if (extrasObj.fuchs) totalPoints += 1;
  if (extrasObj.gegenDieAlten) totalPoints += 1;
  
  // 6. Bock-Runde verdoppelt alle Punkte
  if (bock_round) {
    totalPoints *= 2;
  }
  
  return totalPoints;
}

// Get all games
router.get('/', (req, res) => {
  try {
    const { limit, offset, player_id, game_type } = req.query;
    
    let query = `
      SELECT g.*, 
        GROUP_CONCAT(CASE WHEN gp.team = 're' THEN p.name END) as re_players,
        GROUP_CONCAT(CASE WHEN gp.team = 'kontra' THEN p.name END) as kontra_players
      FROM games g
      LEFT JOIN game_participations gp ON g.id = gp.game_id
      LEFT JOIN players p ON gp.player_id = p.id
    `;
    
    const conditions = [];
    const params = [];
    
    if (player_id) {
      conditions.push('gp.player_id = ?');
      params.push(player_id);
    }
    
    if (game_type) {
      conditions.push('g.game_type = ?');
      params.push(game_type);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' GROUP BY g.id ORDER BY g.date DESC';
    
    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
      
      if (offset) {
        query += ' OFFSET ?';
        params.push(parseInt(offset));
      }
    }
    
    const games = db.prepare(query).all(...params);
    
    // Fetch participations for each game
    const gamesWithParticipations = games.map(game => {
      const participations = db.prepare(`
        SELECT gp.*, p.name, p.avatar_color
        FROM game_participations gp
        JOIN players p ON gp.player_id = p.id
        WHERE gp.game_id = ?
      `).all(game.id);
      
      return {
        ...game,
        participations
      };
    });
    
    res.json(gamesWithParticipations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get game by ID
router.get('/:id', (req, res) => {
  try {
    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(req.params.id);
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    const participations = db.prepare(`
      SELECT gp.*, p.name, p.avatar_color
      FROM game_participations gp
      JOIN players p ON gp.player_id = p.id
      WHERE gp.game_id = ?
    `).all(game.id);
    
    res.json({ ...game, participations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all game days
router.get('/game-days', (req, res) => {
  try {
    const gameDays = db.prepare(`
      SELECT DISTINCT game_day, COUNT(*) as game_count, MIN(date) as first_game
      FROM games
      WHERE game_day IS NOT NULL
      GROUP BY game_day
      ORDER BY game_day DESC
    `).all();
    
    res.json(gameDays);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get global game statistics
router.get('/stats/global', (req, res) => {
  try {
    // Total games
    const totalGamesResult = db.prepare('SELECT COUNT(*) as total_games FROM games').get();
    
    // Average points per game
    const avgPointsResult = db.prepare(`
      SELECT AVG(CASE WHEN points_re > points_kontra THEN points_re ELSE points_kontra END) as avg_points
      FROM games
    `).get();
    
    // Most common extras
    const extrasStats = db.prepare(`
      SELECT extras, COUNT(*) as count
      FROM games
      WHERE extras IS NOT NULL AND extras != ''
      GROUP BY extras
      ORDER BY count DESC
      LIMIT 5
    `).all();
    
    // Bock rounds
    const bockRoundsResult = db.prepare(`
      SELECT COUNT(*) as bock_rounds
      FROM games
      WHERE bock_round = 1
    `).get();
    
    // Solo games
    const soloGamesResult = db.prepare(`
      SELECT game_type, COUNT(*) as count
      FROM games
      WHERE game_type != 'normal'
      GROUP BY game_type
    `).all();
    
    res.json({
      total_games: totalGamesResult.total_games,
      average_points: avgPointsResult.avg_points ? avgPointsResult.avg_points.toFixed(1) : 0,
      extras_stats: extrasStats,
      bock_rounds: bockRoundsResult.bock_rounds,
      solo_games: soloGamesResult
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new game
router.post('/', (req, res) => {
  try {
    const {
      date,
      game_type,
      points_re,
      points_kontra,
      extras,
      announcements,
      bock_round,
      participations
    } = req.body;

    // Validate required fields
    if (!points_re || !points_kontra || !participations || participations.length !== 4) {
      return res.status(400).json({ 
        error: 'points_re, points_kontra, and 4 participations are required' 
      });
    }

    // Determine winner
    const winner_team = points_re >= 121 ? 're' : 'kontra';
    
    // Calculate points
    const gamePoints = calculatePoints({
      points_re,
      points_kontra,
      extras: typeof extras === 'object' ? JSON.stringify(extras) : extras,
      announcements: typeof announcements === 'object' ? JSON.stringify(announcements) : announcements,
      bock_round
    });

    // Determine game_day (format: YYYY-MM-DD)
    const gameDate = date ? new Date(date) : new Date();
    const game_day = gameDate.toISOString().split('T')[0];
    
    // Start transaction
    const insertGame = db.prepare(`
      INSERT INTO games (date, game_day, game_type, winner_team, points_re, points_kontra, extras, announcements, bock_round)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = insertGame.run(
      date || new Date().toISOString(),
      game_day,
      game_type || 'normal',
      winner_team,
      points_re,
      points_kontra,
      typeof extras === 'object' ? JSON.stringify(extras) : extras,
      typeof announcements === 'object' ? JSON.stringify(announcements) : announcements,
      bock_round ? 1 : 0
    );
    
    const gameId = result.lastInsertRowid;
    
    // Insert participations
    const insertParticipation = db.prepare(`
      INSERT INTO game_participations (game_id, player_id, team, points_earned)
      VALUES (?, ?, ?, ?)
    `);
    
    // Determine point distribution
    const isSolo = game_type && game_type !== 'normal';
    
    participations.forEach(p => {
      let points;
      
      if (isSolo) {
        // Bei Soli: Alleinspieler (Re) bekommt 3×, die drei anderen jeweils 1×
        if (p.team === 're') {
          // Solospieler
          points = winner_team === 're' ? gamePoints * 3 : -gamePoints * 3;
        } else {
          // Gegenspieler
          points = winner_team === 'kontra' ? gamePoints : -gamePoints;
        }
      } else {
        // Bei Normalspiel/Hochzeit: alle bekommen gleich viel
        points = p.team === winner_team ? gamePoints : -gamePoints;
      }
      
      insertParticipation.run(gameId, p.player_id, p.team, points);
    });
    
    // Fetch the created game with participations
    const newGame = db.prepare('SELECT * FROM games WHERE id = ?').get(gameId);
    const gameParticipations = db.prepare(`
      SELECT gp.*, p.name, p.avatar_color
      FROM game_participations gp
      JOIN players p ON gp.player_id = p.id
      WHERE gp.game_id = ?
    `).all(gameId);
    
    res.status(201).json({ ...newGame, participations: gameParticipations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update game
router.put('/:id', (req, res) => {
  try {
    const gameId = req.params.id;
    const {
      date,
      game_type,
      points_re,
      points_kontra,
      extras,
      announcements,
      bock_round,
      participations
    } = req.body;

    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Determine winner
    const winner_team = points_re >= 121 ? 're' : 'kontra';
    
    // Calculate points
    const gamePoints = calculatePoints({
      points_re: points_re || game.points_re,
      points_kontra: points_kontra || game.points_kontra,
      extras: extras ? (typeof extras === 'object' ? JSON.stringify(extras) : extras) : game.extras,
      announcements: announcements ? (typeof announcements === 'object' ? JSON.stringify(announcements) : announcements) : game.announcements,
      bock_round: bock_round !== undefined ? bock_round : game.bock_round
    });

    // Determine game_day if date changed
    const updatedDate = date || game.date;
    const gameDate = new Date(updatedDate);
    const game_day = gameDate.toISOString().split('T')[0];
    
    // Update game
    const updateGame = db.prepare(`
      UPDATE games 
      SET date = ?, game_day = ?, game_type = ?, winner_team = ?, points_re = ?, points_kontra = ?, 
          extras = ?, announcements = ?, bock_round = ?
      WHERE id = ?
    `);
    
    updateGame.run(
      updatedDate,
      game_day,
      game_type || game.game_type,
      winner_team,
      points_re || game.points_re,
      points_kontra || game.points_kontra,
      extras ? (typeof extras === 'object' ? JSON.stringify(extras) : extras) : game.extras,
      announcements ? (typeof announcements === 'object' ? JSON.stringify(announcements) : announcements) : game.announcements,
      bock_round !== undefined ? (bock_round ? 1 : 0) : game.bock_round,
      gameId
    );
    
    // Update participations if provided
    if (participations) {
      // Delete old participations
      db.prepare('DELETE FROM game_participations WHERE game_id = ?').run(gameId);
      
      // Insert new participations
      const insertParticipation = db.prepare(`
        INSERT INTO game_participations (game_id, player_id, team, points_earned)
        VALUES (?, ?, ?, ?)
      `);
      
      // Determine point distribution
      const updatedGameType = game_type || game.game_type;
      const isSolo = updatedGameType && updatedGameType !== 'normal';
      
      participations.forEach(p => {
        let points;
        
        if (isSolo) {
          // Bei Soli: Alleinspieler (Re) bekommt 3×, die drei anderen jeweils 1×
          if (p.team === 're') {
            // Solospieler
            points = winner_team === 're' ? gamePoints * 3 : -gamePoints * 3;
          } else {
            // Gegenspieler
            points = winner_team === 'kontra' ? gamePoints : -gamePoints;
          }
        } else {
          // Bei Normalspiel/Hochzeit: alle bekommen gleich viel
          points = p.team === winner_team ? gamePoints : -gamePoints;
        }
        
        insertParticipation.run(gameId, p.player_id, p.team, points);
      });
    }
    
    // Fetch updated game
    const updatedGame = db.prepare('SELECT * FROM games WHERE id = ?').get(gameId);
    const gameParticipations = db.prepare(`
      SELECT gp.*, p.name, p.avatar_color
      FROM game_participations gp
      JOIN players p ON gp.player_id = p.id
      WHERE gp.game_id = ?
    `).all(gameId);
    
    res.json({ ...updatedGame, participations: gameParticipations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete game
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM games WHERE id = ?');
    const result = stmt.run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
