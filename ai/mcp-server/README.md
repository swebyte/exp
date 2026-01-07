# AI Server

HTTP REST API server with PostgreSQL and Ollama AI integration.

## Files

### Main Server (YOU WANT THIS)
- **`server.js`** - HTTP REST API server on port 3001
  - This is what runs by default: `npm start`
  - Use this for HTTP requests from your frontend/apps
  - See `../API.md` for endpoint documentation

### Optional MCP Server (Advanced)
- **`index.mcp.js`** - MCP protocol server (stdio-based)
  - Only for Claude Code integration
  - Runs via: `npm run mcp`
  - Not needed for normal HTTP API usage

## Usage

```bash
# Install dependencies
npm install

# Start HTTP server (port 3001)
npm start

# Start with auto-reload during development
npm run dev

# Start MCP server (only if using Claude Code)
npm run mcp
```

## What Runs in Docker

Docker Compose runs **`server.js`** (the HTTP API server) by default.

```yaml
# In docker-compose.yml
CMD ["npm", "start"]  # Runs server.js
```

## Summary

**99% of the time you want `server.js`** - it's the HTTP API server you can call with `fetch()`, `curl`, or any HTTP client.

The `index.mcp.js` file is only for advanced MCP/Claude Code integration and can be ignored for normal API usage.
