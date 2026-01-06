#!/bin/bash
set -e

# Check if this is a fresh database initialization or a restart
if [ ! -s "$PGDATA/PG_VERSION" ]; then
    # Fresh initialization - let docker-entrypoint.sh handle everything
    # This will run setup.sql and migrate.sh automatically
    echo "Fresh database initialization - running standard setup..."
    exec docker-entrypoint.sh "$@"
else
    # Database already exists - this is a restart
    echo "Database exists - starting PostgreSQL and running migrations..."
    
    # Start PostgreSQL in the background with all arguments passed to the script
    docker-entrypoint.sh "$@" &
    PG_PID=$!
    
    # Wait for PostgreSQL to be ready
    until pg_isready -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" > /dev/null 2>&1; do
        echo "Waiting for PostgreSQL to be ready..."
        sleep 1
    done
    
    echo "PostgreSQL is ready, running migrations..."
    
    # Run the migration script
    if [ -f /usr/local/bin/migrate.sh ]; then
        bash /usr/local/bin/migrate.sh
    else
        echo "Warning: migrate.sh not found"
    fi
    
    echo "Migrations complete. PostgreSQL is running."
    
    # Keep the container alive by waiting for PostgreSQL
    wait $PG_PID
fi
