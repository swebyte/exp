#!/bin/bash
# Simple test script for AI Server API

API_URL="http://localhost:3001"

echo "🧪 Testing AI Server API"
echo "========================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Health check
echo -e "${BLUE}Test 1: Health Check${NC}"
curl -s "$API_URL/health" | json_pp
echo ""

# Test 2: Get schema
echo -e "${BLUE}Test 2: Get Database Schema${NC}"
curl -s "$API_URL/api/schema" | json_pp
echo ""

# Test 3: List blog posts
echo -e "${BLUE}Test 3: List Blog Posts${NC}"
curl -s "$API_URL/api/blog?limit=3" | json_pp
echo ""

# Test 4: List experience
echo -e "${BLUE}Test 4: List Experience Entries${NC}"
curl -s "$API_URL/api/experience" | json_pp
echo ""

# Test 5: List users
echo -e "${BLUE}Test 5: List Users${NC}"
curl -s "$API_URL/api/users" | json_pp
echo ""

# Test 6: Custom query
echo -e "${BLUE}Test 6: Custom SQL Query${NC}"
curl -s -X POST "$API_URL/api/query" \
  -H "Content-Type: application/json" \
  -d '{"query":"SELECT COUNT(*) as total_posts FROM api.blog"}' | json_pp
echo ""

# Test 7: AI Chat
echo -e "${BLUE}Test 7: AI Chat (Ask Question)${NC}"
curl -s -X POST "$API_URL/api/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{"question":"What tables exist in my database?"}' | json_pp
echo ""

# Test 8: AI Query Data
echo -e "${BLUE}Test 8: AI Query Data (Generate SQL + Explain)${NC}"
curl -s -X POST "$API_URL/api/ai/query-data" \
  -H "Content-Type: application/json" \
  -d '{"question":"Show me published blog posts"}' | json_pp
echo ""

echo -e "${GREEN}✅ All tests completed!${NC}"
