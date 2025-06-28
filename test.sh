#!/bin/bash

# Ticket System App Docker Setup Script
# This script sets up the entire Docker environment for the ticket system application

set -e  # Exit on any error

echo "🎫 Starting Ticket System App Docker Setup..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "Docker and Docker Compose are installed ✓"
}

# Create environment file
setup_env() {
    print_step "Setting up environment variables..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_status "Environment file created from .env.example"
        else
            print_warning ".env.example not found, creating default .env file"
            cat > .env << EOF
DB_DATABASE=ticket_system
DB_USERNAME=allan
DB_PASSWORD=allan123
DB_ROOTPASSWORD=rootpassword
EOF
        fi
    else
        print_status "Environment file already exists"
    fi
}

# Setup Laravel backend environment
setup_laravel_env() {
    print_step "Setting up Laravel environment..."
    
    if [ ! -f "src/backend/.env" ]; then
        if [ -f "src/backend/.env.example" ]; then
            cp src/backend/.env.example src/backend/.env
            print_status "Laravel .env created from .env.example"
        else
            print_warning "Laravel .env.example not found, creating default .env file"
            cat > src/backend/.env << EOF
APP_NAME="Ticket System"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=ticket_system
DB_USERNAME=allan
DB_PASSWORD=allan123

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MEMCACHED_HOST=127.0.0.1

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="\${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=mt1

VITE_APP_NAME="\${APP_NAME}"
VITE_PUSHER_APP_KEY="\${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="\${PUSHER_HOST}"
VITE_PUSHER_PORT="\${PUSHER_PORT}"
VITE_PUSHER_SCHEME="\${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="\${PUSHER_APP_CLUSTER}"
EOF
        fi
    else
        print_status "Laravel .env already exists"
    fi
}

# Stop and remove existing containers
cleanup_containers() {
    print_step "Cleaning up existing containers..."
    
    if [ "$(docker ps -q -f name=ticket_)" ]; then
        print_status "Stopping existing containers..."
        docker-compose down
    fi
    
    # Remove dangling images
    if [ "$(docker images -q -f dangling=true)" ]; then
        print_status "Removing dangling images..."
        docker rmi $(docker images -q -f dangling=true) 2>/dev/null || true
    fi
}

# Build and start containers
build_containers() {
    print_step "Building and starting Docker containers..."
    
    print_status "Building containers (this may take a few minutes)..."
    docker-compose build --no-cache
    
    print_status "Starting containers..."
    docker-compose up -d
    
    print_status "Waiting for containers to be ready..."
    sleep 10
}

# Install Laravel dependencies and setup
setup_laravel() {
    print_step "Setting up Laravel application..."
    
    print_status "Installing Composer dependencies..."
    docker-compose exec laravel composer install --no-interaction
    
    print_status "Generating Laravel application key..."
    docker-compose exec laravel php artisan key:generate
    
    print_status "Running database migrations..."
    docker-compose exec laravel php artisan migrate --force
    
    print_status "Seeding database..."
    docker-compose exec laravel php artisan db:seed --force
    
    print_status "Creating storage link..."
    docker-compose exec laravel php artisan storage:link
    
    print_status "Clearing Laravel caches..."
    docker-compose exec laravel php artisan config:clear
    docker-compose exec laravel php artisan cache:clear
    docker-compose exec laravel php artisan route:clear
    docker-compose exec laravel php artisan view:clear
    
    print_status "Installing Laravel Passport..."
    docker-compose exec laravel php artisan passport:install --force
}

# Install frontend dependencies
setup_frontend() {
    print_step "Setting up React frontend..."
    
    if [ -d "src/frontend" ]; then
        print_status "Installing npm dependencies..."
        cd src/frontend
        npm install
        cd ../..
        print_status "Frontend dependencies installed"
    else
        print_warning "Frontend directory not found, skipping frontend setup"
    fi
}

# Set proper permissions
set_permissions() {
    print_step "Setting proper permissions..."
    
    if [ -d "src/backend/storage" ]; then
        sudo chown -R www-data:www-data src/backend/storage src/backend/bootstrap/cache 2>/dev/null || {
            print_warning "Could not set www-data ownership, setting 777 permissions instead"
            chmod -R 777 src/backend/storage src/backend/bootstrap/cache
        }
    fi
}

# Display final information
show_completion_info() {
    echo ""
    echo "================================================"
    echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
    echo "================================================"
    echo ""
    echo "Your ticket system is now running:"
    echo ""
    echo -e "📱 Laravel Backend API: ${BLUE}http://localhost:8000${NC}"
    echo -e "🗄️  MySQL Database: ${BLUE}localhost:3306${NC}"
    echo ""
    echo "Database Details:"
    echo "  - Database: ticket_system"
    echo "  - Username: allan"
    echo "  - Password: allan123"
    echo ""
    echo "Useful commands:"
    echo -e "  ${YELLOW}docker-compose logs -f${NC}           # View logs"
    echo -e "  ${YELLOW}docker-compose exec laravel bash${NC} # Access Laravel container"
    echo -e "  ${YELLOW}docker-compose exec mysql mysql -u allan -p${NC} # Access MySQL"
    echo -e "  ${YELLOW}docker-compose down${NC}              # Stop containers"
    echo -e "  ${YELLOW}docker-compose up -d${NC}             # Start containers"
    echo ""
    echo "Frontend development:"
    echo -e "  ${YELLOW}cd src/frontend && npm run dev${NC}   # Start React dev server"
    echo ""
}

# Main execution
main() {
    print_status "Starting setup process..."
    
    check_docker
    setup_env
    setup_laravel_env
    cleanup_containers
    build_containers
    setup_laravel
    setup_frontend
    set_permissions
    show_completion_info
}

# Handle script interruption
trap 'print_error "Setup interrupted by user"; exit 1' INT

# Run main function
main

print_status "Setup script completed!"