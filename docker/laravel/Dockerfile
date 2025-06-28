FROM php:8.2-cli

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libwebp-dev \
    libxpm-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp
RUN docker-php-ext-install \
    pdo \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip

COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Set environment variables for Composer
ENV COMPOSER_ALLOW_SUPERUSER=1

# Copy composer files first for better Docker layer caching
COPY composer.json composer.lock ./

# Install dependencies first
RUN composer install --optimize-autoloader --no-scripts

# Copy the rest of the application
COPY . .

# Run composer scripts after copying all files
RUN composer dump-autoload --optimize

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

EXPOSE 8000

# Create an entrypoint script to handle dependencies
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

RUN composer install --optimize-autoloader --dev
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]