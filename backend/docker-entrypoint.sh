#!/bin/sh
set -e

echo "Starting application..."

# Wait for MySQL to be reachable on TCP before running migrations.
# node is always available in this image, so we use it for the probe.
MAX_TRIES=30
i=0
DB_HOST="${DATABASE_URL#*@}"
DB_HOST="${DB_HOST%%/*}"
DB_HOST_NAME="${DB_HOST%%:*}"
DB_HOST_PORT="${DB_HOST##*:}"

echo "Waiting for database at ${DB_HOST_NAME}:${DB_HOST_PORT}..."
until node -e "
  var net = require('net');
  var s = net.connect(${DB_HOST_PORT:-3306}, '${DB_HOST_NAME:-mysql}', function(){ process.exit(0); });
  s.on('error', function(){ process.exit(1); });
" 2>/dev/null; do
  i=$((i + 1))
  if [ "$i" -ge "$MAX_TRIES" ]; then
    echo "Database not reachable after ${MAX_TRIES} seconds, aborting."
    exit 1
  fi
  echo "  retry ${i}/${MAX_TRIES}..."
  sleep 1
done

echo "Database is ready."

# Check if migrations directory exists and has migrations
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations)" ]; then
  echo "Running migrations..."
  npx prisma migrate deploy
else
  echo "No migrations found, pushing schema to database..."
  npx prisma db push --accept-data-loss --skip-generate
fi

# Run seed to populate initial data
echo "Running database seed..."
npx prisma db seed || echo "Seed already executed or failed, continuing..."

echo "Starting Node.js application..."
exec node dist/main
