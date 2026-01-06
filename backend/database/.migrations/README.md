# Database Migrations

This directory contains database migration files that are automatically applied when the PostgreSQL container starts.

## How to create a migration

1. Create a new `.sql` file in this directory
2. Name it with a sequential number prefix: `XXX_description.sql`
   - Example: `002_add_user_column.sql`, `003_create_index.sql`
3. Write your SQL statements in the file
4. Restart the container to apply: `docker-compose restart postgres`

## Naming convention

- `001_add_blog_description.sql` ✓
- `002_create_index_on_users.sql` ✓
- `add_column.sql` ✗ (missing number prefix)

## How it works

- Migrations are tracked in the `_migrations` table
- Each migration is applied exactly once
- Migrations are applied in numerical order
- If a migration fails, the process stops

## View applied migrations

```sql
SELECT * FROM _migrations ORDER BY id;
```

## Example migration file

```sql
-- Migration #002: Add email column to users table

ALTER TABLE api.users
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_users_email_verified
ON api.users(email_verified);
```
