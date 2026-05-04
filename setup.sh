#!/usr/bin/env sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
BACKEND_DIR="$ROOT_DIR/src/backend"
FRONTEND_DIR="$ROOT_DIR/src/frontend"
TMP_BASE="${TMPDIR:-${PREFIX:-/tmp}/tmp}"

if [ -t 1 ]; then
    RED=$(printf '\033[0;31m')
    GREEN=$(printf '\033[0;32m')
    YELLOW=$(printf '\033[1;33m')
    BLUE=$(printf '\033[0;34m')
    NC=$(printf '\033[0m')
else
    RED=
    GREEN=
    YELLOW=
    BLUE=
    NC=
fi

info() { printf '%s[INFO]%s %s\n' "$GREEN" "$NC" "$*"; }
warn() { printf '%s[WARN]%s %s\n' "$YELLOW" "$NC" "$*"; }
error() { printf '%s[ERROR]%s %s\n' "$RED" "$NC" "$*" >&2; }
step() { printf '%s[STEP]%s %s\n' "$BLUE" "$NC" "$*"; }

have() {
    command -v "$1" >/dev/null 2>&1
}

is_termux() {
    [ -n "${TERMUX_VERSION:-}" ] || printf '%s' "${PREFIX:-}" | grep -q '/com.termux/'
}

package_install() {
    if [ "${SKIP_SYSTEM_DEPS:-0}" = "1" ]; then
        warn "Skipping system package installation because SKIP_SYSTEM_DEPS=1."
        return 0
    fi

    if is_termux && have pkg; then
        step "Installing required packages with Termux pkg..."
        pkg update
        pkg install -y git nodejs php php-sodium composer mariadb
        return 0
    fi

    if have apt-get; then
        step "Installing required packages with apt..."
        if have sudo; then
            SUDO=sudo
        else
            SUDO=
        fi
        $SUDO apt-get update
        $SUDO apt-get install -y git nodejs npm php-cli php-mbstring php-xml php-curl php-zip php-mysql php-sqlite3 unzip composer mariadb-server mariadb-client
        return 0
    fi

    warn "No supported package manager found. Install PHP, Composer, Node.js, npm, and MariaDB/MySQL manually."
}

require_command() {
    if ! have "$1"; then
        error "Missing required command: $1"
        error "Install the missing dependency, then run ./setup.sh again."
        exit 1
    fi
}

composer_install_flags() {
    if php -r 'exit(PHP_VERSION_ID >= 80500 ? 0 : 1);' >/dev/null 2>&1; then
        printf '%s\n' "--ignore-platform-req=php"
    fi
}

copy_env() {
    src=$1
    dest=$2
    if [ ! -f "$dest" ]; then
        cp "$src" "$dest"
        info "Created $dest"
    fi
}

env_value() {
    file=$1
    key=$2
    if [ ! -f "$file" ]; then
        return 0
    fi
    grep -E "^${key}=" "$file" | tail -n 1 | cut -d= -f2- | sed 's/^"//; s/"$//; s/^'\''//; s/'\''$//'
}

set_env_value() {
    file=$1
    key=$2
    value=$3
    if grep -q "^${key}=" "$file"; then
        tmp="${file}.tmp.$$"
        sed "s#^${key}=.*#${key}=${value}#" "$file" > "$tmp"
        mv "$tmp" "$file"
    else
        printf '%s=%s\n' "$key" "$value" >> "$file"
    fi
}

mysql_cmd() {
    if have mariadb; then
        mariadb "$@"
    else
        mysql "$@"
    fi
}

mysql_admin_cmd() {
    if have mariadb-admin; then
        mariadb-admin "$@"
    else
        mysqladmin "$@"
    fi
}

mysql_ping() {
    mysql_admin_cmd ping -h127.0.0.1 --silent >/dev/null 2>&1 || mysql_admin_cmd ping --silent >/dev/null 2>&1
}

start_database() {
    if mysql_ping; then
        info "MariaDB/MySQL is already running."
        return 0
    fi

    if is_termux; then
        step "Starting MariaDB for Termux..."
        data_dir="${PREFIX:-/data/data/com.termux/files/usr}/var/lib/mysql"
        run_dir="${PREFIX:-/data/data/com.termux/files/usr}/var/run"
        mkdir -p "$run_dir" "$TMP_BASE"
        if [ ! -d "$data_dir/mysql" ]; then
            if have mariadb-install-db; then
                mariadb-install-db --datadir="$data_dir" >/dev/null
            else
                mysql_install_db --datadir="$data_dir" >/dev/null
            fi
        fi
        if have setsid; then
            setsid mariadbd --datadir="$data_dir" --socket="$run_dir/mysqld.sock" --pid-file="$run_dir/mysqld.pid" --port=3306 >"$TMP_BASE/ticket-system-mariadb.log" 2>&1 < /dev/null &
        elif have mariadbd-safe; then
            nohup mariadbd-safe --datadir="$data_dir" >"$TMP_BASE/ticket-system-mariadb.log" 2>&1 < /dev/null &
        else
            nohup mysqld_safe --datadir="$data_dir" >"$TMP_BASE/ticket-system-mariadb.log" 2>&1 < /dev/null &
        fi
    elif have systemctl; then
        step "Starting MariaDB/MySQL with systemctl..."
        if have sudo; then
            sudo systemctl start mariadb 2>/dev/null || sudo systemctl start mysql 2>/dev/null || true
        else
            systemctl start mariadb 2>/dev/null || systemctl start mysql 2>/dev/null || true
        fi
    elif have service; then
        step "Starting MariaDB/MySQL with service..."
        if have sudo; then
            sudo service mariadb start 2>/dev/null || sudo service mysql start 2>/dev/null || true
        else
            service mariadb start 2>/dev/null || service mysql start 2>/dev/null || true
        fi
    else
        warn "Could not start MariaDB/MySQL automatically."
    fi

    tries=30
    while [ "$tries" -gt 0 ]; do
        if mysql_ping; then
            info "MariaDB/MySQL is ready."
            return 0
        fi
        tries=$((tries - 1))
        sleep 2
    done

    error "MariaDB/MySQL did not become ready."
    error "Start it manually, then run ./setup.sh again."
    exit 1
}

database_root_args() {
    root_password=$1
    if [ -n "$root_password" ] && mysql_cmd -uroot "-p${root_password}" -e "SELECT 1" >/dev/null 2>&1; then
        printf '%s\n' "-uroot -p${root_password}"
        return 0
    fi
    if mysql_cmd -uroot -e "SELECT 1" >/dev/null 2>&1; then
        printf '%s\n' "-uroot"
        return 0
    fi
    if mysql_cmd -e "SELECT 1" >/dev/null 2>&1; then
        printf '%s\n' ""
        return 0
    fi
    return 1
}

setup_database() {
    db_name=$(env_value "$BACKEND_DIR/.env" DB_DATABASE)
    db_user=$(env_value "$BACKEND_DIR/.env" DB_USERNAME)
    db_pass=$(env_value "$BACKEND_DIR/.env" DB_PASSWORD)
    root_pass=$(env_value "$ROOT_DIR/.env" DB_ROOTPASSWORD)

    db_name=${db_name:-ticket_system}
    db_user=${db_user:-ticket_user}
    db_pass=${db_pass:-password}

    root_args=$(database_root_args "$root_pass" || true)
    if [ -z "${root_args+x}" ]; then
        root_args=
    fi

    if [ -z "$root_args" ] && ! mysql_cmd -e "SELECT 1" >/dev/null 2>&1; then
        warn "Could not connect as the MariaDB/MySQL root user."
        warn "Create database '$db_name' and user '$db_user' manually if migrations fail."
        return 0
    fi

    step "Creating local database and user..."
    sql="
CREATE DATABASE IF NOT EXISTS \`${db_name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${db_user}'@'localhost' IDENTIFIED BY '${db_pass}';
CREATE USER IF NOT EXISTS '${db_user}'@'127.0.0.1' IDENTIFIED BY '${db_pass}';
GRANT ALL PRIVILEGES ON \`${db_name}\`.* TO '${db_user}'@'localhost';
GRANT ALL PRIVILEGES ON \`${db_name}\`.* TO '${db_user}'@'127.0.0.1';
FLUSH PRIVILEGES;"
    # shellcheck disable=SC2086
    printf '%s\n' "$sql" | mysql_cmd $root_args
}

db_count() {
    table=$1
    db_name=$(env_value "$BACKEND_DIR/.env" DB_DATABASE)
    db_user=$(env_value "$BACKEND_DIR/.env" DB_USERNAME)
    db_pass=$(env_value "$BACKEND_DIR/.env" DB_PASSWORD)

    mysql_cmd -h127.0.0.1 -u"$db_user" "-p${db_pass}" "$db_name" -Nse "SELECT COUNT(*) FROM \`${table}\`;" 2>/dev/null || printf '%s\n' 0
}

ensure_passport_keys() {
    if [ -f "$BACKEND_DIR/storage/oauth-private.key" ] && [ -f "$BACKEND_DIR/storage/oauth-public.key" ]; then
        return 0
    fi

    step "Generating Passport keys with PHP OpenSSL..."
    (cd "$BACKEND_DIR" && php <<'PHP'
<?php
$key = openssl_pkey_new([
    'private_key_bits' => 4096,
    'private_key_type' => OPENSSL_KEYTYPE_RSA,
]);

if (! $key) {
    fwrite(STDERR, "Unable to create Passport keypair.\n");
    exit(1);
}

openssl_pkey_export($key, $privateKey);
$details = openssl_pkey_get_details($key);

file_put_contents('storage/oauth-private.key', $privateKey);
file_put_contents('storage/oauth-public.key', $details['key']);
chmod('storage/oauth-private.key', 0600);
chmod('storage/oauth-public.key', 0600);
PHP
)
}

ensure_passport_clients() {
    personal_count=$(db_count oauth_personal_access_clients)
    password_count=$(mysql_cmd -h127.0.0.1 -u"$(env_value "$BACKEND_DIR/.env" DB_USERNAME)" "-p$(env_value "$BACKEND_DIR/.env" DB_PASSWORD)" "$(env_value "$BACKEND_DIR/.env" DB_DATABASE)" -Nse "SELECT COUNT(*) FROM oauth_clients WHERE password_client = 1;" 2>/dev/null || printf '%s\n' 0)

    if [ "$personal_count" = "0" ]; then
        step "Creating Passport personal access client..."
        (cd "$BACKEND_DIR" && php artisan passport:client --personal --name="Ticket System Personal Access Client")
    fi

    if [ "$password_count" = "0" ]; then
        step "Creating Passport password grant client..."
        (cd "$BACKEND_DIR" && php artisan passport:client --password --name="Ticket System Password Grant Client" --provider=users)
    fi
}

link_lightningcss_wasm() {
    lightning_dir="$FRONTEND_DIR/node_modules/lightningcss"
    wasm_dir="$FRONTEND_DIR/node_modules/lightningcss-wasm"

    if [ -d "$lightning_dir" ] && [ -d "$wasm_dir" ] && [ ! -f "$lightning_dir/pkg/index.js" ]; then
        step "Linking lightningcss wasm fallback for Termux..."
        rm -rf "$lightning_dir/pkg"
        mkdir -p "$lightning_dir/pkg"
        printf '%s\n' '{"main":"index.js"}' > "$lightning_dir/pkg/package.json"
        printf '%s\n' "module.exports = require('lightningcss-wasm');" > "$lightning_dir/pkg/index.js"
    fi
}

main() {
    cd "$ROOT_DIR"

    step "Setting up Ticket System without Docker..."
    package_install

    require_command php
    require_command composer
    require_command node
    require_command npm
    if ! have mysql && ! have mariadb; then
        error "Missing MariaDB/MySQL client. Install mariadb or mysql-client."
        exit 1
    fi

    copy_env "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
    copy_env "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
    copy_env "$FRONTEND_DIR/.env.example" "$FRONTEND_DIR/.env"

    set_env_value "$BACKEND_DIR/.env" DB_HOST 127.0.0.1
    set_env_value "$BACKEND_DIR/.env" APP_URL http://localhost:8000
    set_env_value "$BACKEND_DIR/.env" PUSHER_HOST 127.0.0.1
    set_env_value "$FRONTEND_DIR/.env" VITE_API_BASE_URL http://localhost:8000/api
    set_env_value "$FRONTEND_DIR/.env" VITE_PUSHER_HOST localhost

    start_database
    setup_database

    step "Installing Laravel dependencies..."
    composer_flags=$(composer_install_flags)
    if [ -n "$composer_flags" ]; then
        warn "PHP $(php -r 'echo PHP_VERSION;') is newer than this lockfile supports; using Composer flag: $composer_flags"
    fi
    # shellcheck disable=SC2086
    (cd "$BACKEND_DIR" && composer install $composer_flags)

    step "Preparing Laravel application..."
    (cd "$BACKEND_DIR" && php artisan key:generate --force)
    (cd "$BACKEND_DIR" && php artisan storage:link --force || true)
    (cd "$BACKEND_DIR" && php artisan migrate --force)
    if [ "$(db_count users)" = "0" ]; then
        (cd "$BACKEND_DIR" && php artisan db:seed --force)
    else
        info "Database already has users; skipping seeders."
    fi
    ensure_passport_keys
    ensure_passport_clients
    (cd "$BACKEND_DIR" && php artisan config:clear && php artisan route:clear && php artisan cache:clear)

    step "Installing frontend dependencies..."
    (cd "$FRONTEND_DIR" && npm install)
    link_lightningcss_wasm

    info "Setup complete."
    printf '\nRun the app in separate terminals:\n'
    printf '  cd %s && php artisan serve --host=127.0.0.1 --port=8000\n' "$BACKEND_DIR"
    printf '  cd %s && npm run dev -- --host 0.0.0.0\n' "$FRONTEND_DIR"
    printf '\nOpen http://localhost:5173 for the frontend and http://localhost:8000 for the backend.\n'
}

main "$@"
