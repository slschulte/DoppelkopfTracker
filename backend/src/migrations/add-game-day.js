import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../database/doppelkopf.db');
const db = new Database(dbPath);

console.log('Starting migration: Add game_day column...');

try {
  // Check if column already exists
  const tableInfo = db.prepare("PRAGMA table_info(games)").all();
  const hasGameDay = tableInfo.some(col => col.name === 'game_day');
  
  if (!hasGameDay) {
    console.log('Adding game_day column to games table...');
    db.exec('ALTER TABLE games ADD COLUMN game_day TEXT');
    
    // Update existing games with game_day based on date
    console.log('Updating existing games with game_day...');
    db.exec(`
      UPDATE games 
      SET game_day = DATE(date)
      WHERE game_day IS NULL
    `);
    
    const updatedCount = db.prepare('SELECT COUNT(*) as count FROM games WHERE game_day IS NOT NULL').get();
    console.log(`✓ Updated ${updatedCount.count} games with game_day`);
  } else {
    console.log('✓ Column game_day already exists');
    
    // Ensure all games have game_day set
    const missingCount = db.prepare('SELECT COUNT(*) as count FROM games WHERE game_day IS NULL').get();
    if (missingCount.count > 0) {
      console.log(`Updating ${missingCount.count} games missing game_day...`);
      db.exec(`
        UPDATE games 
        SET game_day = DATE(date)
        WHERE game_day IS NULL
      `);
      console.log('✓ Updated missing game_day values');
    }
  }
  
  console.log('Migration completed successfully!');
} catch (error) {
  console.error('Migration failed:', error);
  process.exit(1);
}

db.close();
