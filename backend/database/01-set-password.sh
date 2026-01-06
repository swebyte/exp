#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    ALTER ROLE authenticator WITH PASSWORD '${AUTHENTICATOR_PASSWORD}';
EOSQL

echo "Authenticator password set from environment variable"
