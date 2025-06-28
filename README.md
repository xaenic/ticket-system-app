# Ticket System Application

A modern ticket management system built with React (TypeScript) frontend and Laravel (PHP) backend, containerized with Docker.

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Laravel 10 + PHP 8.1
- **Database**: MySQL 8.0
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)
- [Git](https://git-scm.com/downloads)

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
- Set up the database
- Generate application keys
- Configure permissions

### 3. Start the Application

```bash
docker-compose up -d
```

### 4. Access the Application

- **Frontend (React)**: http://localhost:5173
- **Backend API (Laravel)**: http://localhost:8000
- **Database**: localhost:3306

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

## ⚙️ Manual Setup (Alternative)

If you prefer to set up manually or the automated script doesn't work:

### 1. Environment Configuration

Create environment files:

```bash
# Copy root environment file
cp .env.example .env

# Copy backend environment file
cp src/backend/.env.example src/backend/.env
```

Edit the `.env` files with your preferred database credentials.

### 2. Build and Start Services

```bash
# Build all containers
docker-compose build

# Start services in detached mode
docker-compose up -d
```

### 3. Backend Setup

```bash
# Install PHP dependencies
docker-compose exec laravel composer install

# Generate application key
docker-compose exec laravel php artisan key:generate

# Generate JWT secret
docker-compose exec laravel php artisan jwt:secret

# Run database migrations
docker-compose exec laravel php artisan migrate

# Seed the database (optional)
docker-compose exec laravel php artisan db:seed
```

### 4. Frontend Setup

```bash
# Install Node.js dependencies
docker-compose exec react npm install
```

## 🛠️ Development Commands

### Docker Management

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs [service_name]

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild specific service
docker-compose build [service_name]

# Restart specific service
docker-compose restart [service_name]
```

### Backend (Laravel) Commands

```bash
# Access Laravel container shell
docker-compose exec laravel bash

# Run Artisan commands
docker-compose exec laravel php artisan [command]

# Run tests
docker-compose exec laravel php artisan test

# Clear caches
docker-compose exec laravel php artisan cache:clear
docker-compose exec laravel php artisan config:clear
docker-compose exec laravel php artisan route:clear
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
docker-compose exec mysql mysql -u root -p

# Create database backup
docker-compose exec mysql mysqldump -u root -p[password] [database_name] > backup.sql

# Restore database backup
docker-compose exec -T mysql mysql -u root -p[password] [database_name] < backup.sql
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

### Resetting the Environment

To completely reset your development environment:

```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove Docker images (optional)
docker-compose down --rmi all

# Clean up Docker system (optional)
docker system prune -a

# Restart setup
./setup.sh
```

