# Quick Start Guide: Using the MCP Server

## TL;DR - What Does This Do?

This MCP server lets you (or Claude Code) **talk to your database using natural language or simple commands**.

Instead of writing SQL, you can:
- Ask "list my blog posts"
- Ask "what experience entries do I have?"
- Ask AI "how many users do I have?"

## Setup (5 minutes)

### 1. Start the services
```bash
cd ai
cp .env.example .env
# Edit .env with your database password from backend/.env
docker-compose up -d
```

### 2. Wait for Ollama to download TinyLlama
```bash
docker-compose logs -f ollama
# Wait until you see "successfully loaded model"
```

### 3. Test it works
```bash
node test-mcp.js list_users
```

You should see your database users!

## Usage Examples

### Example 1: List Your Blog Posts
```bash
node test-mcp.js list_blog_posts '{"limit":3}'
```

**Output:**
```json
[
  {
    "id": 1,
    "title": "My First Post",
    "body": "Content here...",
    "published": true,
    "created_at": "2024-01-05T10:30:00Z",
    "user_id": 1
  },
  {
    "id": 2,
    "title": "Second Post",
    ...
  }
]
```

### Example 2: Get a Specific Blog Post
```bash
node test-mcp.js get_blog_post '{"id":1}'
```

### Example 3: List Your Experience/Portfolio
```bash
node test-mcp.js list_experience
```

**Output:**
```json
[
  {
    "id": 1,
    "title": "Software Engineer",
    "company": "Tech Corp",
    "description": "Developed web applications",
    "start_date": "2023-01-01",
    "end_date": "2024-12-31",
    "created_at": "2024-01-01T00:00:00Z",
    "user_id": 1
  }
]
```

### Example 4: Ask AI About Your Data
```bash
node test-mcp.js ai_query '{"question":"What tables exist in my database?"}'
```

**Output:**
```
Based on the schema, your database has these tables in the 'api' schema:

1. blog - Contains blog posts with id, title, body, published status
2. experience - Contains work experience entries with company, dates
3. users - Contains user accounts with email and roles

Would you like to query any of these tables?
```

### Example 5: Run Custom SQL Query
```bash
node test-mcp.js query_database '{"query":"SELECT COUNT(*) FROM api.blog WHERE published = true"}'
```

**Output:**
```json
[
  {
    "count": "5"
  }
]
```

### Example 6: Get Database Schema
```bash
node test-mcp.js get_schema
```

Shows all tables, columns, and types.

## Using with Claude Code

Once configured in Claude Code, you can just talk naturally:

**You:** "Show me my blog posts"

**Claude:** *Uses list_blog_posts tool automatically*
```
Here are your blog posts:

1. My First Post (ID: 1)
   Published: Yes
   Created: Jan 5, 2024

2. Second Post (ID: 2)
   Published: No
   Created: Jan 4, 2024
```

**You:** "Ask AI: What's the most recent experience entry?"

**Claude:** *Uses ai_query tool with Ollama*
```
To find the most recent experience entry, you would query:

SELECT * FROM api.experience
ORDER BY start_date DESC
LIMIT 1

This will give you the experience entry with the most recent start date.
```

## What Each Tool Does

| Tool | What it does | Example Use |
|------|--------------|-------------|
| `list_blog_posts` | Lists your blog posts | "Show me my recent posts" |
| `get_blog_post` | Gets one post by ID | "Get post #5" |
| `list_experience` | Lists your portfolio entries | "What's on my resume?" |
| `get_experience` | Gets one entry by ID | "Show experience #2" |
| `list_users` | Lists all users | "Who can access the site?" |
| `query_database` | Run custom SQL (SELECT only) | "Count published posts" |
| `get_schema` | Shows database structure | "What tables exist?" |
| `ai_query` | Ask AI about your data | "What's in my database?" |

## How It Works (Simple Explanation)

```
You → test-mcp.js → MCP Server → PostgreSQL
                         ↓
                      Ollama (AI)
```

1. **You** send a request (e.g., "list blog posts")
2. **MCP Server** receives it
3. **MCP Server** queries PostgreSQL database
4. **PostgreSQL** returns data
5. **MCP Server** sends data back to you

For AI queries:
1. You ask a question
2. MCP Server gets database schema
3. MCP Server asks Ollama (TinyLlama AI)
4. Ollama thinks about it and responds
5. MCP Server returns AI's answer

## Common Issues

### "Database connection error"
- Make sure backend database is running: `cd backend && docker-compose ps`
- Check your `.env` file has correct password

### "Ollama not responding"
- Wait for model download: `docker-compose logs -f ollama`
- Check it's running: `curl http://localhost:11434/api/tags`

### "Tool not found"
- Check spelling of tool name
- Run: `node test-mcp.js` (no args) to see available tools

### "Only SELECT queries allowed"
- This is by design for safety!
- MCP server only allows read operations
- To modify data, use your backend API or psql directly

## Next Steps

1. **Try all the examples above** to get familiar
2. **Configure Claude Code** to use it (see README.md)
3. **Add your own tools** (see ARCHITECTURE.md)
4. **Upgrade to better AI model** if you want (see README.md)

## Tips

- Start with `list_` tools - they're the simplest
- Use `ai_query` when you want explanations
- Use `query_database` when you know SQL
- Use `get_schema` when you forget table structure

## Help

If something's not working:
```bash
# Check logs
docker-compose logs mcp-server
docker-compose logs ollama

# Restart everything
docker-compose restart

# Full reset
docker-compose down && docker-compose up -d
```
