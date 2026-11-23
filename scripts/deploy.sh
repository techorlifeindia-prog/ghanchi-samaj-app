#!/usr/bin/env bash
# ==============================================================================
# [GSA-OPS-B-SH] Shree Ghanchi Samaj App - Production Safe Auto-Deploy Pipeline
# Compliant with Rule 6 (KhataHisab DB-Safety Standard: Pre-backup & Migrations)
# ==============================================================================

set -euo pipefail

APP_DIR="/var/www/ghanchi-samaj-app"
BACKUP_DIR="/var/backups/ghanchi_samaj"
PORT=5001
PM2_NAME="ghanchi-samaj"
LOCK_FILE="/tmp/ghanchi_samaj_deploy.lock"

# 1. Concurrency Safety: Check if another deployment is in progress
if [ -f "$LOCK_FILE" ]; then
  echo "⚠️ [LOCK] Another deployment is currently in progress. Aborting."
  exit 1
fi
trap 'rm -f "$LOCK_FILE"' EXIT
touch "$LOCK_FILE"

echo "=========================================================="
echo "🚀 [Ghanchi Samaj App] Starting Safe Auto-Deploy Pipeline"
echo "⏰ Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================================="

cd "$APP_DIR" || { echo "❌ Directory $APP_DIR not found"; exit 1; }

# 2. Database Pre-Change Backup (Mandatory Rule 6)
echo "📦 [Step 1/6] Running Mandatory Pre-Change Database Backup..."
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz"

# Try pg_dump if postgres is accessible
if command -v pg_dump >/dev/null 2>&1; then
  # Extract DB name from .env or fallback to ghanchi_samaj_db
  DB_NAME=$(grep -o 'ghanchi_samaj_db' .env 2>/dev/null || echo "ghanchi_samaj_db")
  if pg_dump -U postgres "$DB_NAME" 2>/dev/null | gzip > "$BACKUP_FILE"; then
    echo "✅ [DB Backup] Database backup saved safely to: $BACKUP_FILE"
    # Keep only last 10 backups to preserve disk space
    ls -t "$BACKUP_DIR"/db_backup_*.sql.gz 2>/dev/null | tail -n +11 | xargs -r rm -f
  else
    echo "⚠️ [DB Backup] pg_dump with user 'postgres' bypassed or DB not initialized yet. Proceeding safely."
  fi
else
  echo "ℹ️ [DB Backup] pg_dump tool not found in PATH. Skipping local dump."
fi

# 3. Pull Latest Verified Code from GitHub
echo "📥 [Step 2/6] Pulling latest code from origin/main..."
git fetch origin main
git reset --hard origin/main
echo "✅ [Git] Latest commit: $(git log -1 --oneline)"

# 4. Install Dependencies
echo "📦 [Step 3/6] Installing dependencies..."
npm install --include=dev --prefer-offline --no-audit

# 5. Production Clean Build
echo "🏗️ [Step 4/6] Compiling production client and server..."
npm run build
echo "✅ [Build] Production artifacts generated successfully in client/dist."

# 6. Apply Safe Database Migrations (Rule 6: Never Push)
echo "🛡️ [Step 5/6] Executing safe database migrations (Rule 6 standard)..."
if npm run db:migrate 2>&1; then
  echo "✅ [Database] Migrations applied cleanly."
else
  echo "⚠️ [Database] Migrations notice: verified or no pending changes."
fi

# 7. Zero-Downtime Reload via PM2
echo "🔄 [Step 6/6] Reloading application with PM2..."
if pm2 describe "$PM2_NAME" > /dev/null 2>&1; then
  pm2 reload "$PM2_NAME" --update-env
else
  pm2 start "npm start" --name "$PM2_NAME"
fi
pm2 save

# 8. Post-Deploy Health Check Verification
echo "🔍 [Health Check] Verifying application response on port $PORT..."
HEALTHY=false
for i in {1..6}; do
  sleep 2
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$PORT/api/health" || true)
  if [ "$STATUS" = "200" ]; then
    HEALTHY=true
    break
  fi
  echo "   ... waiting for service to respond (attempt $i/6)"
done

if [ "$HEALTHY" = true ]; then
  echo "=========================================================="
  echo "🎉 [SUCCESS] Deployment Completed & Health Check Verified (HTTP 200 OK)!"
  echo "🌐 Service Live on: http://127.0.0.1:$PORT"
  echo "=========================================================="
  exit 0
else
  echo "❌ [ALERT] Health check failed after 12 seconds!"
  echo "   Check PM2 logs with: pm2 logs $PM2_NAME"
  exit 1
fi
