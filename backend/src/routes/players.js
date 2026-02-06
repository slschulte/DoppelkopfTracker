import express from 'express';
import db from '../models/database.js';

const router = express.Router();

// Get all players
router.get('/', (req, res) => {
  try {
    const players = db.prepare('SELECT * FROM players ORDER BY name').all();
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get player by ID
router.get('/:id', (req, res) => {
  try {
    const player = db.prepare('SELECT * FROM players WHERE id = ?').get(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get player statistics
router.get('/:id/stats', (req, res) => {
  try {
    const playerId = req.params.id;
    const { game_day } = req.query;
    
    // Basic player info
    const player = db.prepare('SELECT * FROM players WHERE id = ?').get(playerId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Build WHERE clause for game_day filter
    const gameDayFilter = game_day ? 'AND g.game_day = ?' : '';
    const gameDayParams = game_day ? [playerId, game_day] : [playerId];

    // Total points
    const totalPointsResult = db.prepare(`
      SELECT COALESCE(SUM(gp.points_earned), 0) as total_points
      FROM game_participations gp
      JOIN games g ON gp.game_id = g.id
      WHERE gp.player_id = ? ${gameDayFilter}
    `).get(...gameDayParams);

    // Games played
    const gamesPlayedResult = db.prepare(`
      SELECT COUNT(DISTINCT gp.game_id) as games_played
      FROM game_participations gp
      JOIN games g ON gp.game_id = g.id
      WHERE gp.player_id = ? ${gameDayFilter}
    `).get(...gameDayParams);

    // Games won
    const gamesWonResult = db.prepare(`
      SELECT COUNT(*) as games_won
      FROM game_participations gp
      JOIN games g ON gp.game_id = g.id
      WHERE gp.player_id = ? AND gp.points_earned > 0 ${gameDayFilter}
    `).get(...gameDayParams);

    // Games lost
    const gamesLostResult = db.prepare(`
      SELECT COUNT(*) as games_lost
      FROM game_participations gp
      JOIN games g ON gp.game_id = g.id
      WHERE gp.player_id = ? AND gp.points_earned < 0 ${gameDayFilter}
    `).get(...gameDayParams);

    // Solo games
    const soloGamesResult = db.prepare(`
      SELECT COUNT(*) as solo_games
      FROM game_participations gp
      JOIN games g ON gp.game_id = g.id
      WHERE gp.player_id = ? AND g.game_type != 'normal' ${gameDayFilter}
    `).get(...gameDayParams);

    // Yellow cards
    const yellowCardsResult = db.prepare(`
      SELECT COUNT(*) as yellow_cards
      FROM cards
      WHERE player_id = ? AND card_type = 'yellow'
    `).get(playerId);

    // Red cards
    const redCardsResult = db.prepare(`
      SELECT COUNT(*) as red_cards, 
             COUNT(CASE WHEN paid = 0 THEN 1 END) as unpaid_red_cards
      FROM cards
      WHERE player_id = ? AND card_type = 'red'
    `).get(playerId);

    const stats = {
      player,
      total_points: totalPointsResult.total_points,
      games_played: gamesPlayedResult.games_played,
      games_won: gamesWonResult.games_won,
      games_lost: gamesLostResult.games_lost,
      win_rate: gamesPlayedResult.games_played > 0 
        ? ((gamesWonResult.games_won / gamesPlayedResult.games_played) * 100).toFixed(1)
        : 0,
      average_points: gamesPlayedResult.games_played > 0
        ? (totalPointsResult.total_points / gamesPlayedResult.games_played).toFixed(2)
        : 0,
      solo_games: soloGamesResult.solo_games,
      yellow_cards: yellowCardsResult.yellow_cards,
      red_cards: redCardsResult.red_cards,
      unpaid_red_cards: redCardsResult.unpaid_red_cards
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new player
router.post('/', (req, res) => {
  try {
    const { name, avatar_color } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const stmt = db.prepare('INSERT INTO players (name, avatar_color) VALUES (?, ?)');
    const result = stmt.run(name, avatar_color || '#3B82F6');
    
    const newPlayer = db.prepare('SELECT * FROM players WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newPlayer);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Player with this name already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Update player
router.put('/:id', (req, res) => {
  try {
    const { name, avatar_color } = req.body;
    const playerId = req.params.id;

    const player = db.prepare('SELECT * FROM players WHERE id = ?').get(playerId);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const stmt = db.prepare('UPDATE players SET name = ?, avatar_color = ? WHERE id = ?');
    stmt.run(name || player.name, avatar_color || player.avatar_color, playerId);
    
    const updatedPlayer = db.prepare('SELECT * FROM players WHERE id = ?').get(playerId);
    res.json(updatedPlayer);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Player with this name already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// Delete player
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM players WHERE id = ?');
    const result = stmt.run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
