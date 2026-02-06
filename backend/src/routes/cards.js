import express from 'express';
import db from '../models/database.js';

const router = express.Router();

// Get all cards
router.get('/', (req, res) => {
  try {
    const { player_id, card_type, paid } = req.query;
    
    let query = `
      SELECT c.*, p.name as player_name, p.avatar_color
      FROM cards c
      JOIN players p ON c.player_id = p.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (player_id) {
      query += ' AND c.player_id = ?';
      params.push(player_id);
    }
    
    if (card_type) {
      query += ' AND c.card_type = ?';
      params.push(card_type);
    }
    
    if (paid !== undefined) {
      query += ' AND c.paid = ?';
      params.push(paid === 'true' ? 1 : 0);
    }
    
    query += ' ORDER BY c.date DESC';
    
    const cards = db.prepare(query).all(...params);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get unpaid red cards (fines)
router.get('/unpaid', (req, res) => {
  try {
    const cards = db.prepare(`
      SELECT c.*, p.name as player_name, p.avatar_color
      FROM cards c
      JOIN players p ON c.player_id = p.id
      WHERE c.card_type = 'red' AND c.paid = 0
      ORDER BY c.date DESC
    `).all();
    
    // Calculate total unpaid amount (1 Euro per red card)
    const totalUnpaid = cards.length;
    
    res.json({
      cards,
      total_unpaid: totalUnpaid,
      currency: 'EUR'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new card
router.post('/', (req, res) => {
  try {
    const { player_id, card_type, reason, date } = req.body;
    
    if (!player_id || !card_type) {
      return res.status(400).json({ error: 'player_id and card_type are required' });
    }
    
    if (!['yellow', 'red'].includes(card_type)) {
      return res.status(400).json({ error: 'card_type must be either "yellow" or "red"' });
    }
    
    // Check if player exists
    const player = db.prepare('SELECT * FROM players WHERE id = ?').get(player_id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    const stmt = db.prepare(`
      INSERT INTO cards (player_id, card_type, reason, date, paid)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      player_id,
      card_type,
      reason || null,
      date || new Date().toISOString(),
      0
    );
    
    const newCard = db.prepare(`
      SELECT c.*, p.name as player_name, p.avatar_color
      FROM cards c
      JOIN players p ON c.player_id = p.id
      WHERE c.id = ?
    `).get(result.lastInsertRowid);
    
    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update card (e.g., mark as paid)
router.put('/:id', (req, res) => {
  try {
    const cardId = req.params.id;
    const { paid, reason } = req.body;
    
    const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(cardId);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    const stmt = db.prepare(`
      UPDATE cards
      SET paid = ?, reason = ?
      WHERE id = ?
    `);
    
    stmt.run(
      paid !== undefined ? (paid ? 1 : 0) : card.paid,
      reason !== undefined ? reason : card.reason,
      cardId
    );
    
    const updatedCard = db.prepare(`
      SELECT c.*, p.name as player_name, p.avatar_color
      FROM cards c
      JOIN players p ON c.player_id = p.id
      WHERE c.id = ?
    `).get(cardId);
    
    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete card
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM cards WHERE id = ?');
    const result = stmt.run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
