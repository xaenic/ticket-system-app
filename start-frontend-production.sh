#!/usr/bin/env sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
HOST="${FRONTEND_HOST:-0.0.0.0}"
PORT="${FRONTEND_PORT:-5173}"
DIST_DIR="$ROOT_DIR/src/frontend/dist"
ROUTER="$ROOT_DIR/scripts/frontend-router.php"

if [ ! -f "$DIST_DIR/index.html" ]; then
    echo "Frontend build not found. Run ./setup-production.sh first." >&2
    exit 1
fi

exec php -S "$HOST:$PORT" -t "$DIST_DIR" "$ROUTER"
