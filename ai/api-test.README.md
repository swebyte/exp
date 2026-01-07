# API Test File Guide

This `.http` file contains 39 ready-to-use API tests for the AI Server.

## How to Use

### Option 1: VS Code with REST Client (Recommended)

1. **Install REST Client extension:**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "REST Client" by Huachao Mao
   - Click Install

2. **Use the file:**
   - Open `api-test.http`
   - You'll see "Send Request" links above each request
   - Click any "Send Request" link
   - Response appears in a side panel

**Example:**
```
### 1. Health check
GET {{baseUrl}}/health
     ↑ Click "Send Request" here
```

### Option 2: IntelliJ IDEA / WebStorm

IntelliJ has built-in HTTP client support:
1. Open `api-test.http`
2. Click the ▶️ play button next to any request
3. Response shows in a tool window

### Option 3: curl (Manual)

Copy any request and convert to curl:
```bash
# From the .http file:
GET {{baseUrl}}/api/blog

# Becomes:
curl http://localhost:3001/api/blog
```

## File Structure

The file is organized into sections:

1. **Health Check** - Test server is running
2. **Database Schema & Query** - Get schema and run custom SQL
3. **Blog Posts** - CRUD operations for blog posts
4. **Experience Entries** - CRUD operations for portfolio
5. **Users** - User listing
6. **AI Chat** - Ask AI questions about data
7. **AI Query Data** - AI generates SQL and explains
8. **Error Cases** - Test error handling
9. **Complex Queries** - Advanced SQL examples

## Quick Tests to Try

**Start here (easiest):**
```
### 1. Health check
GET {{baseUrl}}/health
```

**Get data:**
```
### 7. List all blog posts
GET {{baseUrl}}/api/blog
```

**Ask AI:**
```
### 18. Ask AI about database structure
POST {{baseUrl}}/api/ai/chat
Content-Type: application/json

{
  "question": "What tables exist in my database?"
}
```

## Tips

**Variable:**
The file uses `@baseUrl = http://localhost:3001` at the top. Change this once to test against different environments:
```
@baseUrl = http://localhost:3001  # Local
# @baseUrl = https://api.production.com  # Production
```

**Comments:**
Lines starting with `#` or `###` are comments and ignored.

**Separators:**
`###` between requests separates them. Don't remove these!

**Request Names:**
The text after `###` is just a description, you can edit it.

## Common Issues

**"Send Request" not showing?**
- Make sure REST Client extension is installed
- File must have `.http` extension
- Reload VS Code if needed

**Connection refused?**
- Start the server: `cd ai && docker-compose up -d`
- Check it's running: `curl http://localhost:3001/health`
- Check port 3001 is not in use by another app

**Request hangs on AI endpoints?**
- AI responses take 2-10 seconds (TinyLlama is thinking!)
- Check Ollama is running: `docker-compose logs ollama`
- Make sure TinyLlama model is downloaded

**404 errors?**
- Check the endpoint path matches the API
- See `API.md` for correct endpoint paths

## Examples of Each Type

**GET request:**
```
GET {{baseUrl}}/api/blog?limit=5
```

**POST request with JSON:**
```
POST {{baseUrl}}/api/query
Content-Type: application/json

{
  "query": "SELECT COUNT(*) FROM api.blog"
}
```

**GET with path parameter:**
```
GET {{baseUrl}}/api/blog/1
```

## Customizing Requests

You can edit any request:

**Change limit:**
```
GET {{baseUrl}}/api/blog?limit=20  # Get 20 posts instead of default
```

**Change AI question:**
```
{
  "question": "Your custom question here"
}
```

**Change SQL query:**
```
{
  "query": "SELECT * FROM api.users WHERE role = 'admin'"
}
```

## Response Formats

All responses are JSON:

**Success:**
```json
{
  "success": true,
  "data": [...]
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Next Steps

1. Start with test #1 (Health check)
2. Try tests #7-11 (Blog posts)
3. Try test #18 (Ask AI a question)
4. Try test #25 (AI generates SQL)
5. Customize questions to fit your data
6. Add your own custom requests at the bottom

Happy testing! 🚀
