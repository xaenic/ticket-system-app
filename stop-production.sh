#!/usr/bin/env sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PID_DIR="$ROOT_DIR/.runtime/pids"

if [ ! -d "$PID_DIR" ]; then
    echo "No production PID directory found."
    exit 0
fi

for pid_file in "$PID_DIR"/*.pid; do
    [ -f "$pid_file" ] || continue
    name=$(basename "$pid_file" .pid)
    pid=$(cat "$pid_file")

    if kill -0 "$pid" 2>/dev/null; then
        echo "Stopping $name PID $pid..."
        kill "$pid"
    else
        echo "$name is not running."
    fi

    rm -f "$pid_file"
done
