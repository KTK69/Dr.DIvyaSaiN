#!/usr/bin/env bash
set -euo pipefail

APP_NAME="${APP_NAME:-drdivya-site}"
APP_DIR="${APP_DIR:-$HOME/Dr.DIvyaSaiN}"
BACKUP_DIR="${BACKUP_DIR:-$APP_DIR/backups}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"

cd "$APP_DIR"

mkdir -p "$BACKUP_DIR"

if [[ -f "data/site-content.runtime.json" ]]; then
  cp "data/site-content.runtime.json" "$BACKUP_DIR/site-content.runtime.$TIMESTAMP.json"
  echo "Backed up CMS data to $BACKUP_DIR/site-content.runtime.$TIMESTAMP.json"
fi

git pull origin main
npm ci --no-audit --no-fund
npm run build:server

if command -v pm2 >/dev/null 2>&1; then
  if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
    pm2 restart "$APP_NAME" --update-env
  else
    pm2 start npm --name "$APP_NAME" -- start
  fi
  pm2 save
else
  echo "pm2 not found. Start the app manually with: npm run start"
fi

echo "Deploy complete."

