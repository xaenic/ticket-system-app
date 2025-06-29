#!/bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}


print_step "Setting up Laravel Docker environment..."
# Load environment variables
cd "$(dirname "$0")"
if [ ! -f .env ]; then
    print_step "Creating root .env file..."
    cp .env.example .env
    print_step "Reloading environment variables..."
    set -a
    source .env
fi

docker compose down -v --remove-orphans

if [ ! -f ./src/backend/.env ]; then
    print_step "Creating Laravel .env file..."
    cp ./src/backend/.env.example ./src/backend/.env
    print_step "Reloading environment variables..."
    
    set -a
    source ./src/backend/.env
fi
if [ ! -f ./src/frontend/.env ]; then
    print_step "Creating Frontend .env file..."
    cp ./src/frontend/.env.example ./src/frontend/.env
    print_step "Reloading environment variables..."
    
    set -a
    source ./src/frontend/.env
fi


print_step "Building and starting Docker containers..."
docker compose build --no-cache
docker compose up -d mysql

print_status "Waiting for MySQL to be ready..."
until docker compose exec mysql mysqladmin ping -h"localhost" --silent; do
    print_status "Waiting for MySQL..."
    sleep 2
done
print_status "MySQL is ready!"



print_status "Waiting for Laravel container to be ready..."
sleep 3

docker compose run --rm laravel bash -c "composer install && php artisan key:generate && php artisan migrate:fresh --seed"


docker compose run --rm laravel php artisan passport:install --force --no-interaction


print_step "Setting up storage link"
docker compose exec laravel php artisan storage:link


print_step "Clearing and caching configuration..."
docker compose run --rm laravel php artisan config:clear
docker compose run --rm laravel php artisan config:cache

docker compose up -d


print_step "Setup complete! Back-End application should be available at ${GREEN}http://localhost:8000${NC}"
print_step "Setup complete! Front-End application should be available at ${GREEN}http://localhost:5173${NC}"
