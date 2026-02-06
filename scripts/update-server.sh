#!/bin/bash
# Server-Update: Git Pull + Docker neu bauen und starten
# Auf dem Server ausführen: ./scripts/update-server.sh oder aus /opt/doppelkopf: ./scripts/update-server.sh

set -e

# In Projektroot wechseln (dort wo docker-compose.yml liegt)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

if [ ! -f "docker-compose.yml" ]; then
  echo "Fehler: docker-compose.yml nicht gefunden in $ROOT_DIR"
  exit 1
fi

echo "=== Doppelkopf Counter – Server-Update ==="
echo "Verzeichnis: $ROOT_DIR"
echo ""

echo "Git Pull..."
git pull

echo ""
echo "Docker: Container stoppen, neu bauen, starten..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

echo ""
echo "Update abgeschlossen."
