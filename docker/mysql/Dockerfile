FROM mysql:8.0

# Custom MySQL configuration if needed
COPY my.cnf /etc/mysql/conf.d/my.cnf

# Healthcheck to ensure container is functioning properly
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 CMD mysqladmin ping -h localhost -u root -p${MYSQL_ROOT_PASSWORD} || exit 1

CMD ["mysqld"]
