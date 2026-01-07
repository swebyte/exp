# AI Services - HTTP API + Ollama

This directory contains AI services for the blog platform:
- **Ollama**: Self-hosted tiny LLM (TinyLlama 1.1B model)
- **HTTP API Server**: Express.js REST API with PostgreSQL + AI integration
- **MCP Server** (optional): Model Context Protocol support for Claude Code

## 📚 Documentation

- **[API.md](./API.md)** - 📡 Complete API documentation with examples
- **[QUICK_START.md](./QUICK_START.md)** - ⚡ Get started in 5 minutes (MCP version)
- **[HOW_IT_WORKS.md](./HOW_IT_WORKS.md)** - 🎓 Simple explanation for everyone
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - 🏗️ Technical architecture details
- **This README** - 📖 Setup and configuration guide

## Services

### 1. Ollama (Port 11434)
- Runs TinyLlama 1.1B parameter model (~637MB)
- Lightweight, fast inference on CPU
- Upgradeable to larger models

### 2. HTTP API Server (Port 3001)
- **Express.js REST API** for HTTP requests
- Connects to PostgreSQL database
- Integrates with Ollama for AI-enhanced responses
- Safe read-only queries by default
- **10 API endpoints** for data access and AI queries
- CORS enabled for frontend integration

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Backend PostgreSQL database running (see `../backend`)

### 1. Environment Setup

Create a `.env` file in the `ai/` directory:

```env
# Copy from backend/.env or set manually
POSTGRES_USER=admin
POSTGRES_PASSWORD=your_password_here
POSTGRES_DB=blogdb

# Database host (use host.docker.internal to access host machine)
DB_HOST=host.docker.internal
DB_PORT=5432
```

Or create a symlink to backend's .env:
```bash
# Windows (as administrator)
mklink .env ..\backend\.env

# Linux/Mac
ln -s ../backend/.env .env
```

### 2. Start Services

```bash
cd ai
docker-compose up -d
```

This will:
1. Start Ollama service
2. Pull TinyLlama model (1.1B parameters, ~637MB)
3. Start HTTP API server on port 3001
4. Connect to your PostgreSQL database

### 3. Test the API

**Using the .http file (Recommended):**
1. Open `api-test.http` in VS Code
2. Install "REST Client" extension if not installed
3. Click "Send Request" above any request
4. View response in side panel

**Using curl:**
```bash
# Test health endpoint
curl http://localhost:3001/health

# Get blog posts
curl http://localhost:3001/api/blog

# Ask AI a question
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"What tables exist?"}'
```

### 4. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f ollama
docker-compose logs -f ai-server
```

### 5. Stop Services

```bash
docker-compose down          # Stop services
docker-compose down -v       # Stop and remove volumes
```

## Using the HTTP API

The server provides a REST API that you can call from anywhere:
- Frontend (Angular, React, Vue, etc.)
- Backend services
- Command line (curl)
- API clients (Postman, Insomnia)

See **[API.md](./API.md)** for complete documentation.

### Quick Examples

```bash
# Get blog posts
curl http://localhost:3001/api/blog?limit=5

# Ask AI a question
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"How many blog posts do I have?"}'

# Get experience entries
curl http://localhost:3001/api/experience

# Run custom SQL
curl -X POST http://localhost:3001/api/query \
  -H "Content-Type: application/json" \
  -d '{"query":"SELECT COUNT(*) FROM api.blog"}'
```

## API Endpoints

### Data Endpoints
1. **GET /api/blog** - List blog posts
2. **GET /api/blog/:id** - Get blog post by ID
3. **GET /api/experience** - List experience entries
4. **GET /api/experience/:id** - Get experience by ID
5. **GET /api/users** - List users
6. **GET /api/schema** - Get database schema
7. **POST /api/query** - Execute custom SQL query

### AI Endpoints
8. **POST /api/ai/chat** - Ask AI questions about your data
9. **POST /api/ai/query-data** - AI generates SQL, executes it, and explains results

### Utility
10. **GET /health** - Health check

See **[API.md](./API.md)** for detailed documentation with examples.

## Server Files

The `mcp-server` directory contains:
- **`server.js`** - HTTP REST API server (main, runs by default)
- **`index.mcp.js`** - MCP stdio server (optional, for Claude Code only)

Docker Compose runs `server.js` by default - the HTTP API you can call from anywhere.

## MCP Server (Optional - Advanced Users Only)

For Claude Code integration, an MCP server is also available in `index.mcp.js` (runs on stdio, not HTTP).

### Available MCP Tools (if using Claude Code)

#### Database Tools
1. **query_database**
   - Execute SQL SELECT queries on PostgreSQL
   - Safe: Only SELECT statements allowed
   - Returns: JSON results

2. **get_schema**
   - Get database schema information
   - Shows tables, columns, types
   - Default schema: `api`

#### AI Tools
3. **ai_query**
   - Ask natural language questions about your data
   - Uses Ollama (TinyLlama) for AI responses
   - Automatically includes schema context

#### Blog Tools
4. **list_blog_posts**
   - List blog posts from database
   - Parameters: limit (default: 10)
   - Returns: id, title, body, published, created_at, user_id

5. **get_blog_post**
   - Get a single blog post by ID
   - Parameters: id (required)
   - Returns: Full blog post object

#### Experience Tools
6. **list_experience**
   - List experience/portfolio entries
   - Parameters: limit (default: 10)
   - Returns: id, title, company, description, start_date, end_date, created_at, user_id

7. **get_experience**
   - Get a single experience entry by ID
   - Parameters: id (required)
   - Returns: Full experience entry object

#### User Tools
8. **list_users**
   - List all users from database
   - Returns: id, email, role, created_at (no passwords)

### Connecting to Claude Code

Add this MCP server to your Claude Code configuration:

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux:** `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "postgres-ai": {
      "command": "docker",
      "args": [
        "exec",
        "-i",
        "mcp-postgres-ai",
        "node",
        "index.js"
      ]
    }
  }
}
```

Then restart Claude Code.

### Testing the MCP Server

**Using the test script:**
```bash
cd ai

# List blog posts
node test-mcp.js list_blog_posts '{"limit":3}'

# Get specific blog post
node test-mcp.js get_blog_post '{"id":1}'

# List experience entries
node test-mcp.js list_experience '{"limit":5}'

# Ask AI a question
node test-mcp.js ai_query '{"question":"What tables exist in the database?"}'

# Query database directly
node test-mcp.js query_database '{"query":"SELECT COUNT(*) FROM api.blog"}'

# Get database schema
node test-mcp.js get_schema
```

### Testing Ollama Directly

```bash
# Test Ollama API
curl http://localhost:11434/api/generate -d '{
  "model": "tinyllama",
  "prompt": "Why is the sky blue?",
  "stream": false
}'

# List available models
curl http://localhost:11434/api/tags
```

## Using Different Models

TinyLlama (1.1B) is the smallest useful model. To use different models:

### Edit docker-compose.yml

Change the model in the `ollama` service command:

```yaml
ollama:
  command: >
    sh -c "ollama serve &
           sleep 10 &&
           ollama pull qwen2.5:0.5b &&
           wait"
```

And update MCP server environment:

```yaml
mcp-server:
  environment:
    OLLAMA_MODEL: qwen2.5:0.5b
```

### Available Small Models

- **qwen2.5:0.5b** - 0.5B params (smallest, ~500MB)
- **tinyllama** - 1.1B params (~637MB)
- **qwen2.5:1.5b** - 1.5B params
- **phi3:mini** - 3.8B params (better quality, larger)

## Architecture

```
┌─────────────────┐
│   Claude Code   │
│   (MCP Client)  │
└────────┬────────┘
         │ MCP Protocol (stdio)
         │
┌────────▼────────────────────┐
│  MCP Server (Node.js)       │
│  - Database queries         │
│  - Schema inspection        │
│  - AI integration           │
└─────┬──────────────┬────────┘
      │              │
      │              │ HTTP API
      │              │
┌─────▼──────┐  ┌───▼────────┐
│ PostgreSQL │  │   Ollama   │
│  Database  │  │ (TinyLlama)│
└────────────┘  └────────────┘
```

## Development

### Local Development (without Docker)

1. Install Ollama locally:
```bash
# Download from https://ollama.ai
ollama serve
ollama pull tinyllama
```

2. Run MCP server:
```bash
cd mcp-server
npm install
npm start
```

Set environment variables:
```bash
export DB_HOST=localhost
export DB_PASSWORD=your_password
export OLLAMA_URL=http://localhost:11434
```

### Adding New MCP Tools

Edit `mcp-server/index.js`:

1. Add tool definition in `tools/list` handler
2. Add tool implementation in `tools/call` handler

Example:
```javascript
// In tools/list
{
  name: 'my_new_tool',
  description: 'Description here',
  inputSchema: {
    type: 'object',
    properties: {
      param: { type: 'string', description: 'Parameter description' }
    },
    required: ['param']
  }
}

// In tools/call
case 'my_new_tool': {
  const { param } = args;
  // Your implementation
  return {
    content: [{ type: 'text', text: 'Result' }]
  };
}
```

## Troubleshooting

### MCP server can't connect to PostgreSQL

**Problem:** `Database connection error`

**Solutions:**
1. Check backend database is running: `cd ../backend && docker ps`
2. Verify .env file has correct credentials
3. Use `host.docker.internal` for DB_HOST (connects to host machine)
4. On Linux, may need `172.17.0.1` instead of `host.docker.internal`

### Ollama model download fails

**Problem:** Model pull hangs or fails

**Solutions:**
1. Check internet connection
2. Pull model manually first: `docker exec -it ollama-service ollama pull tinyllama`
3. Check disk space (models are 500MB-2GB)

### MCP server not responding

**Problem:** Tools don't work in Claude Code

**Solutions:**
1. Check logs: `docker-compose logs mcp-server`
2. Verify container is running: `docker ps`
3. Restart services: `docker-compose restart`
4. Restart Claude Code

### Out of memory errors

**Problem:** Ollama crashes with OOM

**Solutions:**
1. Use smaller model (qwen2.5:0.5b)
2. Allocate more Docker memory in Docker Desktop settings
3. Close other applications

## Performance Notes

### TinyLlama 1.1B
- **Size:** 637MB
- **RAM:** ~2GB during inference
- **Speed:** Fast on CPU (2-5 tokens/sec)
- **Quality:** Basic responses, good for simple tasks

### When to upgrade models
- **qwen2.5:1.5b** - Better reasoning, still fast
- **phi3:mini** - Much better quality, needs 8GB RAM
- **llama3.2:3b** - Production quality, needs 16GB RAM

## Security Notes

- MCP server only allows SELECT queries (read-only by default)
- No database modifications through MCP tools
- Add authentication for production use
- Ollama runs on internal network only (11434 exposed for development)

## Future Enhancements

- [ ] Add streaming responses for Ollama
- [ ] Implement query result caching
- [ ] Add authentication/authorization
- [ ] Support for multiple database connections
- [ ] Query result visualization tools
- [ ] Natural language to SQL translation
