# Ticket System Application

A modern ticket management system built with React (TypeScript) frontend and Laravel (PHP) backend.

<img width="1907" height="907" alt="image" src="https://github.com/user-attachments/assets/0e0a2f54-3ffa-45e7-be6e-f9f46a07d443" />

## ✨ Key Features

- **User Role Management**: Multiple user roles including admin, agent, and client 
- **Ticket Creation & Tracking**: Create, assign, update, and track support tickets throughout their lifecycle
- **Real-time Notifications**: Instant notifications for ticket updates and status changes powered by Pusher, Laravel Echo, and Soketi WebSockets
- **Knowledge Base**: Searchable help center for common issues and self-service solutions
- **Dashboard & Analytics**: Visual reporting and analytics of ticket metrics and team performance
- **File Attachments**: Ability to attach files and screenshots to tickets for better context
- **Comment System**: Threaded comments on tickets 
- **Mobile Responsive**: Full functionality on mobile devices with responsive design

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Laravel 10 + PHP 8.1
- **Database**: MySQL 8.0
- **Local development**: Shell setup script for Termux, proot, and Linux environments without Docker

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Git](https://git-scm.com/downloads)
- PHP 8.1 or higher
- Composer
- Node.js and npm
- MariaDB or MySQL

On Termux, `setup.sh` can install these with `pkg`. On Debian/Ubuntu proot environments, it can install them with `apt`.

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ticket-system-app
```

### 2. Environment Setup

The application includes an automated setup script that will configure your environment:

```bash
chmod +x setup.sh
./setup.sh
```

This script will:
- Create necessary environment files
- Install dependencies
- Start and set up a local MariaDB/MySQL database
- Generate application keys
- Configure permissions

### 3. Start the Application

Run the backend and frontend in separate terminals:

```bash
cd src/backend
php artisan serve --host=127.0.0.1 --port=8000
```

```bash
cd src/frontend
npm run dev -- --host 0.0.0.0
```

### 4. Access the Application

- **Frontend (React)**: http://localhost:5173
- **Backend API (Laravel)**: http://localhost:8000
- **Database**: localhost:3306

## Production Setup Without Docker

Use `setup-production.sh` for a production-style install on Termux, proot, or Linux. It includes default env values, so you can run it directly:

```bash
chmod +x setup-production.sh
./setup-production.sh
```

For a real public server, override the defaults:

```bash
APP_URL=https://api.example.com FRONTEND_URL=https://example.com PUSHER_HOST=ws.example.com PUSHER_SCHEME=https VITE_PUSHER_TLS=true ./setup-production.sh
```

The production script installs Composer dependencies without dev packages, runs migrations, creates Passport keys and clients if missing, caches Laravel config/views/events, and builds frontend assets into `src/frontend/dist`. It does not run seeders unless `RUN_SEEDERS=1` is set.

It also installs Soketi for realtime websockets under `.runtime/soketi` and writes `start-soketi.sh`. Start the websocket server with:

```bash
./start-soketi.sh
```

Production run scripts are included:

```bash
./start-production.sh
./stop-production.sh
```

You can also run services individually:

```bash
./start-backend-production.sh
./start-frontend-production.sh
./start-soketi.sh
```

For a public deployment, point `PUSHER_HOST` at the websocket hostname and set `PUSHER_SCHEME=https` plus `VITE_PUSHER_TLS=true` when Soketi is behind TLS.

### 5. Default Login Credentials

The application comes with pre-configured user accounts for testing:

**Admin Account:**
- Email: `admin@example.com`
- Password: `password`

**Client Account:**
- Email: `client@example.com`
- Password: `password`

## 🐳 Docker Services

The application consists of three main services:

### React Frontend Service
- **Container**: `ticket_react`
- **Port**: 5173
- **Build Context**: Uses `./docker/react/Dockerfile`
- **Volume Mounts**: 
  - `./src/frontend:/app` (source code)
  - `/app/node_modules` (dependencies cache)

### Laravel Backend Service
- **Container**: `ticket_laravel`
- **Port**: 8000
- **Build Context**: Uses `./docker/laravel/Dockerfile`
- **Volume Mounts**:
  - `./src/backend:/var/www/html` (source code)
  - `./docker/laravel/php.ini:/usr/local/etc/php/conf.d/local.ini` (PHP configuration)

### MySQL Database Service
- **Container**: `ticket_mysql`
- **Port**: 3306
- **Build Context**: Uses `./docker/mysql/Dockerfile`
- **Volume Mounts**:
  - `mysql_data:/var/lib/mysql` (persistent data storage)
  
### Soketi WebSocket Service
- **Container**: `ticket_soketi`
- **Port**: 6001
- **Image**: Uses `quay.io/soketi/soketi:latest`
- **Environment**:
  - Configured with the same Pusher credentials as in the application
  - Enables debugging in development mode
  - Default application details for seamless integration

## ⚙️ Manual Setup (Alternative)

If you prefer to set up manually or the automated script doesn't work:

### 1. Environment Configuration

Create environment files:

```bash
# Copy root environment file
cp .env.example .env

# Copy backend environment file
cp src/backend/.env.example src/backend/.env

# Copy frontend environment file
cp src/frontend/.env.example src/frontend/.env
```

Edit the `.env` files with your preferred database credentials.

### 2. Build and Start Services

```bash
# Build all containers
docker compose build

# Start services in detached mode
docker compose up -d
```

### 3. Backend Setup

```bash
# Install PHP dependencies
docker compose exec laravel composer install

# Generate application key
docker compose exec laravel php artisan key:generate

docker compose exec laravel php artisan passport:install --force --no-interaction

# Run database migrations
docker compose exec laravel php artisan migrate:fres 
# Seed the database (optional 
docker compose exec laravel php artisan db:seed
```

### 4. Frontend Setup

```bash
# Install Node.js dependencies
docker compose exec react npm install
```

## 🛠️ Development Commands

### Docker Management

```bash
# View running containers
docker compose ps

# View logs
docker compose logs [service_name]

# Stop all services
docker compose down

# Stop and remove volumes
docker compose down -v

# Rebuild specific service
docker compose build [service_name]

# Restart specific service
docker compose restart [service_name]
```

### Backend (Laravel) Commands

```bash
# Access Laravel container shell
docker compose exec laravel bash 
# Run  rtisan commands
docker compose exec laravel php artisan [command] 
# Run  ests
docker compose exec laravel php artisan test 
# Clea  caches
docker compose exec laravel php artisan cache:clear
docker compose exec laravel php artisan config:clear
docker compose exec laravel php artisan route:clear
```

### Frontend (React) Commands

```bash
# Access React container shell
docker-compose exec react sh

# Install new package
docker-compose exec react npm install [package-name]

# Run linting
docker-compose exec react npm run lint

# Build for production
docker-compose exec react npm run build
```

### Database Management

```bash
# Access MySQL container
docker compose exec mysql mysql -u root -p

# Create database backup
docker compose exec mysql mysqldump -u root -p[password] [database_name] > backup.sql

# Restore database backup
docker compose exec -T mysql mysql -u root -p[password] [database_name] < backup.sql
```

### Test Coverage

View test coverage reports in `src/backend/coverage-report/index.html` after running tests.

## 📂 Project Structure

```
ticket-system-app/
├── docker/                 # Docker configuration files
│   ├── laravel/            # Laravel container setup
│   ├── mysql/              # MySQL container setup
│   └── react/              # React container setup
├── src/
│   ├── backend/            # Laravel application
│   └── frontend/           # React application
├── docker-compose.yml      # Docker Compose configuration
├── setup.sh               # Automated setup script
├── test.sh                # Test runner script
└── README.md              # This file
```

## 🔧 Configuration

### Environment Variables

Key environment variables (in `.env`):

```env
# Database Configuration
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=ticket_system
DB_USERNAME=ticket_user
DB_PASSWORD=your_password
DB_ROOTPASSWORD=root_password

# Application
APP_NAME="Ticket System"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Frontend
VITE_API_URL=http://localhost:8000/api
```

### Port Configuration

Default ports can be modified in `docker-compose.yml`:
- React: `5173:5173`
- Laravel: `8000:8000`
- MySQL: `3306:3306`

### Real-time Communication Setup

The application uses a powerful real-time communication stack:

- **Pusher**: Cloud service for WebSockets communication
- **Laravel Echo**: JavaScript library that makes subscribing to channels and listening for events easy
- **Soketi**: Self-hosted, open-source WebSockets server compatible with the Pusher protocol

Key environment variables for real-time communication (in `.env`):

```env
# WebSockets Configuration
PUSHER_APP_ID=app-id
PUSHER_APP_KEY=app-key
PUSHER_APP_SECRET=app-secret
PUSHER_HOST=soketi
PUSHER_PORT=6001
PUSHER_SCHEME=http
PUSHER_APP_CLUSTER=mt1

# Frontend Echo Configuration
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_HOST="${PUSHER_HOST}"
VITE_PUSHER_PORT="${PUSHER_PORT}"
VITE_PUSHER_SCHEME="${PUSHER_SCHEME}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :5173  # or 8000, 3306
   
   # Stop the process or change ports in docker-compose.yml
   ```

2. **Permission issues**
   ```bash
   # Fix Laravel storage permissions
   docker-compose exec laravel chmod -R 775 storage bootstrap/cache
   ```

3. **Database connection issues**
   ```bash
   # Check if MySQL container is running
   docker-compose ps mysql
   
   # Check MySQL logs
   docker-compose logs mysql
   ```

4. **Frontend not loading**
   ```bash
   # Check React container logs
   docker-compose logs react
   
   # Rebuild React container
   docker-compose build react
   ```

5. **WebSocket connection issues**
   ```bash
   # Check Soketi container logs
   docker-compose logs soketi
   
   # Verify environment variables are correctly set
   docker-compose exec laravel cat .env | grep PUSHER
   docker-compose exec react cat .env | grep VITE_PUSHER
   
   # Restart Soketi service
   docker-compose restart soketi
   ```

### Resetting the Environment

To completely reset your development environment:

```bash
# Stop and remove all containers, networks, and volumes
docker compose down -v

# Remove Docker images (optional)
docker compose down --rmi all

# Clean up Docker system (optional)
docker system prune -a

# Restart setup
./setup.sh
```
