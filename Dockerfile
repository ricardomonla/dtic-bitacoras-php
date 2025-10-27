FROM php:8.1-apache

# Instalar extensiones PHP necesarias
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Habilitar mod_rewrite para Apache
RUN a2enmod rewrite

# Instalar herramientas adicionales
RUN apt-get update && apt-get install -y \
    vim \
    nano \
    && rm -rf /var/lib/apt/lists/*

# Configurar directorio de trabajo
WORKDIR /var/www/html

# Copiar archivos del proyecto
COPY . /var/www/html/

# Configurar Apache para servir desde _www-app/ y permitir acceso completo
RUN echo '<VirtualHost *:80>\n    DocumentRoot /var/www/html/_www-app\n    <Directory /var/www/html/_www-app>\n        AllowOverride All\n        Require all granted\n        DirectoryIndex index.html index.php\n    </Directory>\n    <Directory /var/www/html>\n        AllowOverride All\n        Require all granted\n        Options Indexes FollowSymLinks\n        AllowOverride All\n        Require all granted\n    </Directory>\n</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Crear directorios necesarios
RUN mkdir -p /var/www/html/database /var/www/html/logs /var/www/html/api /var/www/html/config /var/www/html/includes

# Configurar permisos
RUN chown -R www-data:www-data /var/www/html/
RUN chmod -R 755 /var/www/html/database/
RUN chmod -R 755 /var/www/html/logs/

# Exponer puerto 80
EXPOSE 80