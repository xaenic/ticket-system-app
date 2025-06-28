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

docker compose down -v 

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


# Build and start containers
print_step "Building and starting Docker containers..."
docker-compose up -d --build

print_status "Waiting for MySQL to be ready..."
until docker-compose exec mysql mysqladmin ping -h"localhost" --silent; do
    print_status "Waiting for MySQL..."
    sleep 2
done
print_status "MySQL is ready!"



print_status "Waiting for Laravel container to be ready..."
sleep 10

print_step "Generating Laravel application key..."
docker-compose exec laravel php artisan key:generate --force



print_step "Running database migrations..."
docker-compose exec laravel php artisan migrate --force --no-interaction

print_step "Running database seeders..."
docker-compose exec laravel php artisan db:seed 


docker-compose exec laravel php artisan passport:install --force --no-interaction


print_step "Setting up storage link"
docker-compose exec laravel php artisan storage:link


print_step "Clearing and caching configuration..."
docker-compose exec laravel php artisan config:clear
docker-compose exec laravel php artisan config:cache

print_step "Setup complete! Back-End application should be available at ${GREEN}http://localhost:8000${NC}"
print_step "Setup complete! Front-End application should be available at ${GREEN}http://localhost:5173${NC}"
