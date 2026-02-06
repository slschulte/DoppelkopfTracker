import express from 'express';
import cors from 'cors';
import { initDatabase } from './models/database.js';
import playersRouter from './routes/players.js';
import gamesRouter from './routes/games.js';
import cardsRouter from './routes/cards.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
initDatabase();

// Routes (mit und ohne /api-Prefix, falls Proxy den Pfad ändert)
app.use('/api/players', playersRouter);
app.use('/players', playersRouter);
app.use('/api/games', gamesRouter);
app.use('/games', gamesRouter);
app.use('/api/cards', cardsRouter);
app.use('/cards', cardsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Doppelkopf Counter API is running' });
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Doppelkopf Counter API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
