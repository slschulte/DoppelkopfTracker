#!/bin/bash

# Deployment-Script für Doppelkopf Counter
# Verwendung: ./scripts/deploy.sh

set -e

echo "🚀 Starting Doppelkopf Counter Deployment..."

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Funktion für Info-Ausgaben
info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

# Funktion für Warnungen
warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Funktion für Fehler
error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Prüfe ob Docker installiert ist
if ! command -v docker &> /dev/null; then
    error "Docker ist nicht installiert. Bitte installieren Sie Docker erst."
fi

if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose ist nicht installiert. Bitte installieren Sie Docker Compose erst."
fi

info "Docker und Docker Compose gefunden ✓"

# Prüfe ob docker-compose.yml existiert
if [ ! -f "docker-compose.yml" ]; then
    error "docker-compose.yml nicht gefunden. Bitte im Projektverzeichnis ausführen."
fi

# Erstelle Datenverzeichnis falls nicht vorhanden
if [ ! -d "data/database" ]; then
    info "Erstelle Datenverzeichnis..."
    mkdir -p data/database
    chmod 755 data/database
fi

# Erstelle Backup-Verzeichnis
if [ ! -d "backups" ]; then
    info "Erstelle Backup-Verzeichnis..."
    mkdir -p backups
fi

# Backup der Datenbank erstellen (falls vorhanden)
if [ -f "data/database/doppelkopf.db" ]; then
    DATE=$(date +%Y%m%d_%H%M%S)
    info "Erstelle Datenbank-Backup: doppelkopf_${DATE}.db"
    cp data/database/doppelkopf.db backups/doppelkopf_${DATE}.db
fi

# Mit SSL-Override bauen/starten, falls vorhanden (HTTPS + Basic Auth)
COMPOSE="-f docker-compose.yml"
[ -f "docker-compose.ssl.yml" ] && COMPOSE="$COMPOSE -f docker-compose.ssl.yml"

# Alte Container stoppen
if [ "$(docker ps -q -f name=doppelkopf)" ]; then
    info "Stoppe laufende Container..."
    docker-compose $COMPOSE down
fi

# Images bauen
info "Baue Docker Images..."
docker-compose $COMPOSE build --no-cache

# Container starten
info "Starte Container..."
docker-compose $COMPOSE up -d

# Warte auf Backend-Start
info "Warte auf Backend-Start..."
sleep 5

# Prüfe Backend-Health
MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        info "Backend ist bereit ✓"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        error "Backend startet nicht. Prüfen Sie die Logs: docker-compose logs backend"
    fi
    sleep 2
done

# Prüfe Frontend-Health
info "Prüfe Frontend..."
if curl -s http://localhost/ > /dev/null 2>&1; then
    info "Frontend ist bereit ✓"
else
    warn "Frontend konnte nicht erreicht werden. Prüfen Sie die Logs: docker-compose logs frontend"
fi

# Status anzeigen
info "Container-Status:"
docker-compose $COMPOSE ps

echo ""
echo -e "${GREEN}✓ Deployment erfolgreich!${NC}"
echo ""
echo "📊 Die Anwendung ist erreichbar unter:"
echo "   Frontend: http://localhost/ (bzw. https:// mit SSL-Override)"
echo "   Backend:  http://localhost:3000/api/"
echo ""
echo "📝 Nützliche Befehle:"
echo "   Logs anzeigen:    docker-compose $COMPOSE logs -f"
echo "   Status prüfen:    docker-compose $COMPOSE ps"
echo "   Neu starten:      docker-compose $COMPOSE restart"
echo "   Stoppen:          docker-compose $COMPOSE down"
echo ""
