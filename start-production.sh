#!/usr/bin/env sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
RUNTIME_DIR="$ROOT_DIR/.runtime"
LOG_DIR="$RUNTIME_DIR/logs"
PID_DIR="$RUNTIME_DIR/pids"

mkdir -p "$LOG_DIR" "$PID_DIR"

start_service() {
    name=$1
    shift

    pid_file="$PID_DIR/$name.pid"
    log_file="$LOG_DIR/$name.log"

    if [ -f "$pid_file" ] && kill -0 "$(cat "$pid_file")" 2>/dev/null; then
        echo "$name already running with PID $(cat "$pid_file")"
        return 0
    fi

    echo "Starting $name..."
    if command -v setsid >/dev/null 2>&1; then
        setsid "$@" >"$log_file" 2>&1 < /dev/null &
    else
        nohup "$@" >"$log_file" 2>&1 < /dev/null &
    fi
    echo "$!" > "$pid_file"
    echo "$name PID $(cat "$pid_file"), log $log_file"
}

start_service soketi "$ROOT_DIR/start-soketi.sh"
start_service backend "$ROOT_DIR/start-backend-production.sh"
start_service frontend "$ROOT_DIR/start-frontend-production.sh"

echo
echo "Production processes started."
echo "Backend:  http://localhost:${BACKEND_PORT:-8000}"
echo "Frontend: http://localhost:${FRONTEND_PORT:-5173}"
echo "Soketi:   ws://localhost:${SOKETI_PORT:-6001}"
