import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure database directory exists
const dbDir = join(__dirname, '../../database');
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const dbPath = join(dbDir, 'doppelkopf.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initDatabase() {
  // Create players table
  db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      avatar_color TEXT DEFAULT '#3B82F6',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create games table
  db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      game_day TEXT,
      game_type TEXT DEFAULT 'normal',
      winner_team TEXT,
      points_re INTEGER,
      points_kontra INTEGER,
      extras TEXT,
      announcements TEXT,
      bock_round BOOLEAN DEFAULT 0
    )
  `);

  // Create game_participations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS game_participations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id INTEGER,
      player_id INTEGER,
      team TEXT,
      points_earned INTEGER,
      FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
      FOREIGN KEY (player_id) REFERENCES players(id)
    )
  `);

  // Create cards table
  db.exec(`
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_id INTEGER,
      card_type TEXT,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      reason TEXT,
      paid BOOLEAN DEFAULT 0,
      FOREIGN KEY (player_id) REFERENCES players(id)
    )
  `);

  console.log('Database initialized successfully');
}

export default db;
