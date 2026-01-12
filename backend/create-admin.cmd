@echo off
REM This script creates an admin user in the database
REM Usage: create-admin.cmd
REM Note: This file is gitignored - customize for your environment

REM Configuration - CHANGE THESE VALUES
set ADMIN_EMAIL=admin
set ADMIN_PASSWORD=admin

REM Database connection - adjust if needed
set DB_CONTAINER=postgres-blogdb
set DB_USER=admin
set DB_NAME=blogdb

echo Creating admin user...

docker exec -i %DB_CONTAINER% psql -U %DB_USER% -d %DB_NAME% -c "INSERT INTO api.users (email, password, role) VALUES ('%ADMIN_EMAIL%', crypt('%ADMIN_PASSWORD%', gen_salt('bf')), 'authenticated') ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password; SELECT 'Admin user created/updated: %ADMIN_EMAIL%' as result;"

echo.
echo Done! You can now login with:
echo Email: %ADMIN_EMAIL%
echo Password: %ADMIN_PASSWORD%
echo.
echo WARNING: Remember to change the password after first login!
pause
