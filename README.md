# 🃏 Doppelkopf Counter

Eine moderne Web-Anwendung zur Verwaltung und Auswertung von Doppelkopf-Spielen.

## Features

### ✨ Kern-Funktionen

- **Spielerverwaltung**: Spieler anlegen, bearbeiten und löschen mit individuellen Avatar-Farben
- **Spieltage-System** ✨ NEU: Punkte absolut (gesamt) oder relativ (pro Spieltag) anzeigen
- **Spiele erfassen**: Vollständiges Formular mit automatischer Punkteberechnung
  - Normale Spiele und Solo-Varianten (Dame, Bube, Trumpf, Hochzeit)
  - Extras: Karlchen, Doppelkopf, Fuchs gefangen, Gegen die Alten
  - Ansagen: Re/Kontra, keine 90/60/30/0
  - Bock-Runden mit doppelten Punkten
- **Rangliste**: Übersichtliche Darstellung mit Ranking, Statistiken und Trends
- **Karten-System**: Gelbe Karten (Verwarnung) und Rote Karten (1€ Strafe)
- **Detaillierte Statistiken**: Globale und spielerbezogene Auswertungen
- **Spielverlauf**: Komplette Historie mit Filter- und Bearbeitungsfunktionen

### 📱 Design

- **Responsive**: Optimiert für Desktop, Tablet und Mobile
- **Modern UI**: Tailwind CSS mit Doppelkopf-Thema
- **Intuitive Navigation**: Desktop Sidebar, Mobile Bottom Navigation
- **Smooth Transitions**: Ansprechende Animationen und Übergänge

## Technologie-Stack

### Backend

- **Node.js** mit Express.js
- **SQLite** Datenbank (better-sqlite3)
- **REST API** mit vollständigem CRUD
- **ES Modules** (moderne JavaScript-Syntax)

### Frontend

- **Vue 3** mit Composition API und `<script setup>`
- **TypeScript** für Type Safety
- **Pinia** State Management
- **Vue Router** für Navigation
- **Tailwind CSS** für Styling
- **Axios** für HTTP Requests
- **Vite** als Build Tool

## Installation

### Lokale Entwicklung

#### Voraussetzungen

- Node.js v18 oder höher
- npm oder yarn

#### Backend einrichten

```bash
cd backend
npm install
npm start
```

Der Backend-Server läuft auf `http://localhost:3000`

#### Frontend einrichten

```bash
cd frontend
npm install
npm run dev
```

Das Frontend läuft auf `http://localhost:5173`

### 🐳 Docker Deployment (Produktion)

Für Deployment auf einem Server mit Docker:

```bash
# Schnellstart
./scripts/deploy.sh

# Oder manuell
docker-compose build
docker-compose up -d
```

Die Anwendung läuft dann auf:
- Frontend: http://YOUR_SERVER_IP/
- Backend: http://YOUR_SERVER_IP/api/

**Dokumentation:**
- **`DOKUMENTATION.md`** – Vollständige Doku (Features, Hosting, Wartung)
- **`GITHUB.md`** – Projekt auf GitHub pushen, Code verwalten, Server-Updates
- `QUICK_DEPLOY.md` – Schnellstart-Anleitung
- `DEPLOYMENT.md` – Ausführliches Docker-Deployment

## Entwicklung

### Backend starten (mit Auto-Reload)

```bash
cd backend
npm run dev
```

### Frontend starten

```bash
cd frontend
npm run dev
```

### Frontend bauen für Produktion

```bash
cd frontend
npm run build
```

## Projektstruktur

```
DoppelkopfCounter/
├── backend/                 # Node.js Backend
│   ├── src/
│   │   ├── models/         # Datenbank-Modelle
│   │   │   └── database.js
│   │   ├── routes/         # API Routes
│   │   │   ├── players.js
│   │   │   ├── games.js
│   │   │   └── cards.js
│   │   └── server.js       # Express App
│   ├── database/           # SQLite Datenbank
│   └── package.json
│
├── frontend/               # Vue.js Frontend
│   ├── src/
│   │   ├── components/    # UI Komponenten
│   │   ├── views/         # Seiten
│   │   ├── stores/        # Pinia Stores
│   │   ├── services/      # API Services
│   │   ├── types/         # TypeScript Definitionen
│   │   ├── router/        # Vue Router
│   │   ├── App.vue
│   │   └── main.ts
│   └── package.json
│
└── README.md
```

## API-Endpunkte

### Players

- `GET /api/players` - Alle Spieler
- `GET /api/players/:id` - Spieler Details
- `GET /api/players/:id/stats` - Spieler-Statistiken
- `POST /api/players` - Neuer Spieler
- `PUT /api/players/:id` - Spieler bearbeiten
- `DELETE /api/players/:id` - Spieler löschen

### Games

- `GET /api/games` - Alle Spiele (mit Filtern)
- `GET /api/games/:id` - Spiel Details
- `GET /api/games/stats/global` - Globale Statistiken
- `POST /api/games` - Neues Spiel
- `PUT /api/games/:id` - Spiel bearbeiten
- `DELETE /api/games/:id` - Spiel löschen

### Cards

- `GET /api/cards` - Alle Karten (mit Filtern)
- `GET /api/cards/unpaid` - Unbezahlte Strafen
- `POST /api/cards` - Neue Karte
- `PUT /api/cards/:id` - Karte bearbeiten
- `DELETE /api/cards/:id` - Karte löschen

## Doppelkopf-Regeln

Die Anwendung implementiert die offiziellen Doppelkopf-Regeln:

### Punkteberechnung

- Basispunkt: 1 Punkt für Sieg
- Zusätzliche Punkte für keine 90/60/30/0
- Extras: Karlchen, Doppelkopf, Fuchs, Gegen die Alten
- Ansagen verdoppeln: Re, Kontra
- Bock-Runden: Alle Punkte werden verdoppelt

### Spieltypen

- **Normal**: Klassisches 4er-Spiel
- **Dame-Solo**: Solo mit Damen als höchste Trümpfe
- **Buben-Solo**: Solo mit Buben als höchste Trümpfe
- **Trumpf-Solo**: Solo mit allen Trümpfen
- **Hochzeit**: Spezialfall mit Hochzeits-Karten

## Lizenz

Privates Projekt - Alle Rechte vorbehalten

## Kontakt

Bei Fragen oder Problemen bitte ein Issue erstellen.
