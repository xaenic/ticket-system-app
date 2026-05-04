#!/usr/bin/env sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
HOST="${BACKEND_HOST:-0.0.0.0}"
PORT="${BACKEND_PORT:-8000}"

cd "$ROOT_DIR/src/backend"
exec php artisan serve --host="$HOST" --port="$PORT"
