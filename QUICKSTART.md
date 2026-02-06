# 🚀 Quick Start Guide

## Status: ✅ Application Running!

Both backend and frontend servers are currently running:

- **Backend API**: http://localhost:3000
- **Frontend App**: http://localhost:5173

## ⚠️ Wichtige Hinweise

### Punkteberechnung
Die Punkteberechnung folgt den offiziellen DDV-Turnierspielregeln:
- ✅ **Positive Punkte = GUT** (Gewinner erhalten +Punkte)
- ❌ **Negative Punkte = SCHLECHT** (Verlierer erhalten -Punkte)

Siehe `DOPPELKOPF_REGELN.md` für Details.

### Spieltage-Feature ✨ NEU
Die Anwendung unterstützt jetzt **absolute und relative Punkteansichten**:
- **📊 Absolut**: Gesamtpunkte über alle Spieltage
- **📅 Relativ**: Punkte nur für einen bestimmten Spieltag

**Verwendung:**
1. Gehe zur Rangliste (Startseite)
2. Wähle oben rechts im Dropdown zwischen "Absolut" und einem Spieltag
3. Die Statistiken werden automatisch neu berechnet

Siehe `SPIELTAGE_FEATURE.md` für ausführliche Dokumentation.

## Getting Started

Open your browser and navigate to: **http://localhost:5173**

## First Steps

1. **Create Players**: Go to "Spieler" tab and add 4+ players
2. **Record a Game**: Go to "Neues Spiel" and fill out the form
3. **View Leaderboard**: Check the "Rangliste" to see rankings
4. **Manage Cards**: Use "Statistiken" → "Gelbe/Rote Karten" for penalties

## Project Structure

```
✅ Backend (Port 3000)
   - Express + SQLite
   - REST API with CRUD operations
   - Automatic point calculation
   - Database: backend/database/doppelkopf.db

✅ Frontend (Port 5173)
   - Vue 3 + TypeScript
   - Pinia state management
   - Tailwind CSS styling
   - Responsive design
```

## Available Features

### ✨ Player Management
- Create, edit, delete players
- Custom avatar colors
- Detailed player statistics

### 🎮 Game Tracking
- Normal and Solo games (Dame, Bube, Trumpf, Hochzeit)
- Automatic point calculation
- Extras: Karlchen, Doppelkopf, Fuchs, Gegen die Alten
- Announcements: Re/Kontra, keine 90/60/30/0
- Bock rounds with double points

### 🏆 Leaderboard
- Real-time rankings by total points
- Win rate and average points
- Trend indicators
- Medal system (🥇🥈🥉)

### 🃏 Card System
- Yellow cards (warnings)
- Red cards (1€ fines)
- Payment tracking
- Unpaid fines overview

### 📊 Statistics
- Global game statistics
- Player-specific stats
- Solo game breakdown
- Complete game history with filters

## Development Commands

### Backend
```bash
cd backend
npm start        # Start server
npm run dev      # Start with auto-reload
```

### Frontend
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## API Endpoints

### Players
- GET `/api/players` - All players
- GET `/api/players/:id/stats` - Player statistics
- POST `/api/players` - Create player
- PUT `/api/players/:id` - Update player
- DELETE `/api/players/:id` - Delete player

### Games
- GET `/api/games` - All games (with filters)
- GET `/api/games/stats/global` - Global statistics
- POST `/api/games` - Create game
- PUT `/api/games/:id` - Update game
- DELETE `/api/games/:id` - Delete game

### Cards
- GET `/api/cards` - All cards (with filters)
- GET `/api/cards/unpaid` - Unpaid red cards
- POST `/api/cards` - Create card
- PUT `/api/cards/:id` - Update card (mark as paid)
- DELETE `/api/cards/:id` - Delete card

## Technology Stack

**Backend:**
- Node.js + Express
- SQLite (better-sqlite3)
- ES Modules

**Frontend:**
- Vue 3 (Composition API)
- TypeScript
- Pinia (state management)
- Vue Router
- Tailwind CSS
- Vite

## Notes

- Database file is created automatically at `backend/database/doppelkopf.db`
- All game points are calculated automatically based on Doppelkopf rules
- The app is fully responsive (mobile, tablet, desktop)
- Foreign key constraints are enabled for data integrity

## Stopping the Servers

To stop the servers:
1. Backend: Find the terminal running `npm start` and press `Ctrl+C`
2. Frontend: Find the terminal running `npm run dev` and press `Ctrl+C`

## Troubleshooting

**Backend won't start:**
- Check if port 3000 is already in use
- Ensure Node.js v18+ is installed
- Run `npm install` again in backend directory

**Frontend won't start:**
- Check if port 5173 is already in use
- Ensure backend is running first
- Run `npm install` again in frontend directory

**Database errors:**
- Delete `backend/database/doppelkopf.db` and restart backend
- Database will be recreated automatically

---

**Ready to play! 🎴🃏**
