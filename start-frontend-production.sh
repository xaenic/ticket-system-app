#!/usr/bin/env sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

echo "Production frontend is served by Laravel on the backend port."
echo "Run: $ROOT_DIR/start-backend-production.sh"
exec "$ROOT_DIR/start-backend-production.sh"
