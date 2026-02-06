# Doppelkopf-Regeln Implementierung

Basierend auf den offiziellen Turnierspielregeln des DDV (Deutscher Doppelkopf-Verband) wie auf [doppelkopf-palast.de](https://www.doppelkopf-palast.de/doppelkopf-regeln/) beschrieben.

## Punktesystem

### ✅ Wichtig: Positive Punkte = Gut!

- **Gewinner** erhalten **positive Punkte** (+)
- **Verlierer** erhalten **negative Punkte** (-)

### Grundregeln

- **Re-Partei** braucht **≥ 121 Augen** zum Gewinn
- **Kontra-Partei** braucht **≥ 120 Augen** zum Gewinn
- Insgesamt sind **240 Augen** im Spiel

## Punkteberechnung

### 1. Grundwert
**+1 Punkt** für das gewonnene Spiel

### 2. Ansagen
- **+2 Punkte** für Re-Ansage
- **+2 Punkte** für Kontra-Ansage

_Diese Punkte bekommt die Gewinnerpartei, egal wer angesagt hat._

### 3. Erreichte Stufen (Automatisch)
Für jeden unterschrittenen Schwellwert des Verlierers erhält der Gewinner **+1 Punkt**:

- Verlierer < 90 Augen: **+1 Punkt** (keine 90)
- Verlierer < 60 Augen: **+1 Punkt** (keine 60)
- Verlierer < 30 Augen: **+1 Punkt** (keine 30)
- Verlierer = 0 Augen: **+1 Punkt** (schwarz)

_Diese Punkte sind kumulativ! Bei 50 Augen des Verlierers gibt es +3 Punkte._

### 4. Erfüllte Absagen (Optional)
Wenn eine Absage gemacht wurde UND erfüllt wurde, gibt es **zusätzlich +1 Punkt**:

- "keine 90" abgesagt UND Verlierer < 90: **+1 Punkt**
- "keine 60" abgesagt UND Verlierer < 60: **+1 Punkt**
- "keine 30" abgesagt UND Verlierer < 30: **+1 Punkt**
- "schwarz" abgesagt UND Verlierer = 0: **+1 Punkt**

### 5. Sonderpunkte (Extras)
Nur bei Normalspiel/Hochzeit (Zweierparteien):

- **+1 Punkt** für Karlchen (letzter Stich mit eigenem Kreuz-Buben)
- **+1 Punkt** für Doppelkopf (Stich mit 40+ Augen)
- **+1 Punkt** für Fuchs gefangen (Karo-As des Gegners gewonnen)
- **+1 Punkt** gegen die Alten (Kontra-Partei gewinnt gegen Kreuz-Damen)

### 6. Bock-Runde
Alle berechneten Punkte werden **verdoppelt** (×2)

## Punkteverteilung

### Bei Normalspiel / Hochzeit (Teams)
Alle Spieler bekommen **gleich viele Punkte**:
- Gewinner: jeweils **+Punkte**
- Verlierer: jeweils **-Punkte**

**Beispiel:** Re gewinnt mit 5 Punkten
- 2 Re-Spieler: jeweils **+5 Punkte**
- 2 Kontra-Spieler: jeweils **-5 Punkte**

### Bei Soli (Alleinspieler)
Der **Solospieler** bekommt das **Dreifache**:
- Solospieler gewinnt: **+3× Punkte**
- Solospieler verliert: **-3× Punkte**

Die drei **Gegenspieler** bekommen jeweils **das Einfache**:
- Gegner gewinnen: jeweils **+1× Punkte**
- Gegner verlieren: jeweils **-1× Punkte**

**Beispiel:** Solospieler gewinnt mit 8 Punkten
- Solospieler: **+24 Punkte** (8×3)
- 3 Gegner: jeweils **-8 Punkte** (8×1)

_Die Summe aller Punkte ist immer 0: +24 + (-8) + (-8) + (-8) = 0_

## Rechenbeispiele

### Beispiel 1: Einfaches Normalspiel
- Re gewinnt mit 150:90 Augen
- Keine Ansagen, keine Extras

**Berechnung:**
- Grundwert: +1
- Verlierer < 90: +1
- **Gesamt: 2 Punkte**

**Verteilung:**
- Re-Spieler: jeweils +2
- Kontra-Spieler: jeweils -2

### Beispiel 2: Normalspiel mit Re-Ansage
- Re gewinnt mit 180:60 Augen
- Re wurde angesagt
- 1 Doppelkopf gemacht

**Berechnung:**
- Grundwert: +1
- Re-Ansage: +2
- Verlierer < 90: +1
- Verlierer < 60: +1
- Doppelkopf: +1
- **Gesamt: 6 Punkte**

**Verteilung:**
- Re-Spieler: jeweils +6
- Kontra-Spieler: jeweils -6

### Beispiel 3: Herz-Solo mit Bock
- Solo gewinnt mit 200:40 Augen
- Bock-Runde aktiv
- Kontra wurde von Gegner angesagt
- Karlchen gemacht

**Berechnung:**
- Grundwert: +1
- Kontra-Ansage: +2
- Verlierer < 90: +1
- Verlierer < 60: +1
- Verlierer < 30: +1
- Karlchen: +1
- Zwischensumme: 7
- Bock ×2: **14 Punkte**

**Verteilung (Solo!):**
- Solospieler: +42 Punkte (14×3)
- 3 Gegner: jeweils -14 Punkte (14×1)

### Beispiel 4: Solo verloren
- Solo verliert mit 100:140 Augen
- Re wurde vom Solospieler angesagt

**Berechnung:**
- Grundwert: +1
- Re-Ansage: +2
- Verlierer < 90: 0 (Solospieler hat 100)
- **Gesamt: 3 Punkte** (für die Gewinner!)

**Verteilung:**
- Solospieler: -9 Punkte (3×3)
- 3 Gegner: jeweils +3 Punkte (3×1)

## Spieltypen

### Normalspiel
- 2 vs 2 (Re-Partei mit Kreuz-Damen vs Kontra)
- Normale Trumpfreihenfolge

### Hochzeit
- Spieler mit beiden Kreuz-Damen sucht Partner
- Partner wird durch ersten fremden Stich ermittelt
- Ansonsten wie Normalspiel

### Soli
Der Solospieler ist allein die Re-Partei:
- **Dame-Solo**: Nur Damen sind Trumpf
- **Buben-Solo**: Nur Buben sind Trumpf
- **Trumpf-Solo / Farbsolo**: Eine Farbe wird zu Trumpf
- **Fleischloser**: Keine Trümpfe

Bei Soli gilt die **3×/1× Punkteverteilung**!

## Implementierung

Die Punkteberechnung erfolgt automatisch im Backend (`backend/src/routes/games.js`).
Die Vorschau wird im Frontend berechnet (`frontend/src/views/GameView.vue`).

Beide Implementierungen folgen exakt den hier beschriebenen Regeln.
