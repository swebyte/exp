@echo off
REM Simple test script for AI Server API (Windows)

set API_URL=http://localhost:3001

echo Testing AI Server API
echo ========================
echo.

echo Test 1: Health Check
curl -s "%API_URL%/health"
echo.
echo.

echo Test 2: Get Database Schema
curl -s "%API_URL%/api/schema"
echo.
echo.

echo Test 3: List Blog Posts
curl -s "%API_URL%/api/blog?limit=3"
echo.
echo.

echo Test 4: List Experience Entries
curl -s "%API_URL%/api/experience"
echo.
echo.

echo Test 5: List Users
curl -s "%API_URL%/api/users"
echo.
echo.

echo Test 6: Custom SQL Query
curl -s -X POST "%API_URL%/api/query" -H "Content-Type: application/json" -d "{\"query\":\"SELECT COUNT(*) as total_posts FROM api.blog\"}"
echo.
echo.

echo Test 7: AI Chat
curl -s -X POST "%API_URL%/api/ai/chat" -H "Content-Type: application/json" -d "{\"question\":\"What tables exist in my database?\"}"
echo.
echo.

echo Test 8: AI Query Data
curl -s -X POST "%API_URL%/api/ai/query-data" -H "Content-Type: application/json" -d "{\"question\":\"Show me published blog posts\"}"
echo.
echo.

echo All tests completed!
pause
