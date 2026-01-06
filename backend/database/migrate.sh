#!/bin/bash
set -e

MIGRATIONS_DIR="/docker-entrypoint-initdb.d/.migrations"
DB_USER="${POSTGRES_USER}"
DB_NAME="${POSTGRES_DB}"

echo "===================="
echo "Running migrations..."
echo "===================="

# Create migrations tracking table if it doesn't exist
psql -v ON_ERROR_STOP=1 --username "$DB_USER" --dbname "$DB_NAME" <<-EOSQL
    CREATE TABLE IF NOT EXISTS _migrations (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT NOW()
    );
EOSQL

# Check if migrations directory exists
if [ ! -d "$MIGRATIONS_DIR" ]; then
    echo "No migrations directory found. Skipping migrations."
    exit 0
fi

# Check if there are any migration files
if [ -z "$(ls -A $MIGRATIONS_DIR/*.sql 2>/dev/null)" ]; then
    echo "No migration files found. Skipping migrations."
    exit 0
fi

# Apply migrations in order
for migration_file in $(ls -1 "$MIGRATIONS_DIR"/*.sql 2>/dev/null | sort); do
    migration_name=$(basename "$migration_file")
    migration_id=$(echo "$migration_name" | grep -oE '^[0-9]+')
    
    if [ -z "$migration_id" ]; then
        echo "⚠ Skipping: $migration_name (filename must start with a number)"
        continue
    fi
    
    # Check if migration was already applied
    already_applied=$(psql -v ON_ERROR_STOP=1 --username "$DB_USER" --dbname "$DB_NAME" -tAc \
        "SELECT COUNT(*) FROM _migrations WHERE id = $migration_id;")
    
    if [ "$already_applied" -eq "0" ]; then
        echo "Applying migration: $migration_name"
        psql -v ON_ERROR_STOP=1 --username "$DB_USER" --dbname "$DB_NAME" -f "$migration_file"
        
        # Record migration
        psql -v ON_ERROR_STOP=1 --username "$DB_USER" --dbname "$DB_NAME" <<-EOSQL
            INSERT INTO _migrations (id, name) VALUES ($migration_id, '$migration_name');
EOSQL
        echo "✓ Applied: $migration_name"
    else
        echo "⊘ Skipped: $migration_name (already applied)"
    fi
done

echo "===================="
echo "Migrations complete!"
echo "===================="
