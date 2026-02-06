# Spieltage-Feature

## Übersicht

Die Anwendung unterstützt jetzt die Anzeige von Punkten sowohl **absolut** (über alle Spiele) als auch **relativ zu einzelnen Spieltagen**.

## Was ist ein Spieltag?

Ein Spieltag ist ein einzelner Tag, an dem Doppelkopf gespielt wurde. Die Anwendung gruppiert Spiele automatisch nach Datum (YYYY-MM-DD Format).

### Automatische Erkennung

- Jedes Spiel wird automatisch einem Spieltag zugeordnet
- Der Spieltag basiert auf dem Datum des Spiels (ohne Uhrzeit)
- Alle Spiele vom selben Tag gehören zum selben Spieltag

**Beispiel:**
- Spiele vom 05.02.2026 → Spieltag "2026-02-05"
- Spiele vom 12.02.2026 → Spieltag "2026-02-12"

## Funktionen

### 1. Absolute Ansicht (Standard)

Zeigt die **Gesamtpunkte** über alle Spieltage hinweg:
- Kumulierte Punkte seit Beginn
- Alle Spiele werden berücksichtigt
- Zeigt die Gesamtleistung jedes Spielers

**Verwendung:**
- Dropdown-Filter: "📊 Absolut (Alle Spiele)"

### 2. Relative Ansicht (Pro Spieltag)

Zeigt Punkte **nur für einen bestimmten Spieltag**:
- Isolierte Betrachtung eines einzelnen Spieltags
- Nur Spiele von diesem Tag werden gezählt
- Ideal für Tageswertungen und Vergleiche

**Verwendung:**
- Dropdown-Filter: "📅 [Datum] ([Anzahl] Spiele)"
- Wählen Sie einen Spieltag aus der Liste

## Implementierung

### Backend

#### Datenbank-Schema
```sql
ALTER TABLE games ADD COLUMN game_day TEXT;
```

Das Feld `game_day` wird automatisch beim Erstellen/Bearbeiten eines Spiels gesetzt.

#### API-Endpunkte

**Spieltage abrufen:**
```
GET /api/games/game-days
```
Gibt alle verfügbaren Spieltage zurück mit Anzahl der Spiele.

**Statistiken nach Spieltag:**
```
GET /api/players/:id/stats?game_day=2026-02-05
```
Filtert die Statistiken auf einen bestimmten Spieltag.

### Frontend

#### Rangliste (HomeView)

Die Rangliste bietet oben rechts ein Dropdown-Menü:

```
Ansicht:
┌──────────────────────────────────────┐
│ 📊 Absolut (Alle Spiele)             │  ← Standard
│ 📅 Di, 05.02.2026 (12 Spiele)        │
│ 📅 Sa, 01.02.2026 (8 Spiele)         │
└──────────────────────────────────────┘
```

**Verhalten:**
- Beim Wechsel werden alle Statistiken neu geladen
- Die Rangliste zeigt nur Punkte für den gewählten Filter
- Hinweis unter dem Dropdown zeigt aktive Filterung

## Anwendungsfälle

### 1. Gesamt-Meisterschaft
**Szenario:** Wer ist über die gesamte Saison der beste Spieler?
- **Lösung:** Absolute Ansicht verwenden
- Zeigt kumulative Leistung über alle Spieltage

### 2. Tagessieger
**Szenario:** Wer hat an einem bestimmten Abend am besten gespielt?
- **Lösung:** Relative Ansicht für den Spieltag
- Isolierte Tageswertung unabhängig von vorherigen Tagen

### 3. Verlaufs-Analyse
**Szenario:** Wie hat sich ein Spieler über mehrere Spieltage entwickelt?
- **Lösung:** Zwischen Spieltagen wechseln
- Vergleich der Leistung an verschiedenen Tagen

### 4. Aufholjagd
**Szenario:** Ein Spieler liegt gesamt zurück, will aber wissen, ob er einen einzelnen Abend dominiert hat
- **Lösung:** Relative Ansicht zeigt starke Tagesleistung
- Motivation durch Teilerfolge

## Beispiel-Szenarien

### Beispiel 1: Normaler Spielabend

**Spieltag: 05.02.2026**

Absolute Ansicht:
```
🥇 Anna:    +45 Punkte (15 Spiele)
🥈 Bob:     +32 Punkte (15 Spiele)
🥉 Clara:   +12 Punkte (15 Spiele)
   David:   -89 Punkte (15 Spiele)
```

Relative Ansicht (nur 05.02.2026, 8 Spiele):
```
🥇 Clara:   +18 Punkte (8 Spiele)
🥈 Anna:    +12 Punkte (8 Spiele)
🥉 Bob:     +4 Punkte (8 Spiele)
   David:   -34 Punkte (8 Spiele)
```

**Interpretation:**
- Clara hatte ihren besten Tag am 05.02.
- Obwohl sie gesamt auf Platz 3 ist, hat sie diesen Abend gewonnen
- Das motiviert sie für den nächsten Spieltag!

### Beispiel 2: Mehrere Spieltage

**Gesamtübersicht (Absolut):**
```
Spieler   | Spieltag 1 | Spieltag 2 | Spieltag 3 | Gesamt
----------|------------|------------|------------|--------
Anna      | +24        | +12        | +9         | +45
Bob       | +8         | +15        | +9         | +32
Clara     | -12        | +18        | +6         | +12
David     | -20        | -45        | -24        | -89
```

Man kann nun jeden Spieltag einzeln analysieren!

## Technische Details

### Automatische Zuweisung

Beim Erstellen eines Spiels:
```javascript
const gameDate = new Date(date);
const game_day = gameDate.toISOString().split('T')[0];
// Beispiel: "2026-02-05"
```

### Filterung in SQL

```sql
-- Absolute Statistik (alle Spiele)
SELECT SUM(points_earned) FROM game_participations WHERE player_id = ?

-- Relative Statistik (nur ein Spieltag)
SELECT SUM(gp.points_earned) 
FROM game_participations gp
JOIN games g ON gp.game_id = g.id
WHERE gp.player_id = ? AND g.game_day = '2026-02-05'
```

### Frontend State Management

Der Store verwaltet:
- `gameDays`: Liste aller verfügbaren Spieltage
- `selectedGameDay`: Aktuell ausgewählter Filter
- Automatisches Neuladen bei Änderung

## Vorteile

✅ **Flexibilität:** Wechsel zwischen absoluter und relativer Ansicht
✅ **Motivation:** Tagessiege auch bei schlechter Gesamtplatzierung
✅ **Analyse:** Detaillierte Leistungsverfolgung über Zeit
✅ **Automatisch:** Keine manuelle Zuordnung nötig
✅ **Einfach:** Intuitive Dropdown-Auswahl

## Zukünftige Erweiterungen

Mögliche weitere Features:
- Vergleich zwischen Spieltagen (Differenz-Ansicht)
- Grafische Darstellung des Verlaufs über Spieltage
- Export von Spieltag-Statistiken
- Beste/Schlechteste Spieltage pro Spieler
- Spieltag-Kategorien (z.B. "Turnier", "Training")

## Migration bestehender Daten

Falls bereits Spiele in der Datenbank existieren:
```sql
-- Automatische Zuweisung für alte Spiele
UPDATE games 
SET game_day = DATE(date) 
WHERE game_day IS NULL;
```

Die Anwendung weist aber automatisch bei jedem Update den korrekten `game_day` zu.
