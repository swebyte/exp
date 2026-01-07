# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack blog/portfolio application with:
- **Backend**: PostgreSQL database + PostgREST API (Docker-based)
- **Frontend**: Angular 20 SPA with SSR/prerendering
- **AI Services**: MCP server + Ollama (TinyLlama 1.1B) for AI-enhanced database queries
- **Architecture**: JWT authentication, REST API via PostgREST, Nginx reverse proxy

## Repository Structure

```
.
├── backend/                    # Backend services (Docker Compose setup)
│   ├── backend/jwt/           # JWT secret generation utilities (Go)
│   ├── database/              # PostgreSQL init scripts and migrations
│   │   ├── 00-setup.sql      # Initial schema (users, blog, experience tables)
│   │   ├── 01-set-password.sh # Sets authenticator role password
│   │   └── .migrations/      # Numbered migration files (auto-applied once)
│   ├── docker-compose.yml    # PostgreSQL + PostgREST + Nginx
│   ├── Dockerfile            # PostgREST image
│   ├── Dockerfile.postgres   # Custom PostgreSQL image
│   └── create-admin.cmd      # Creates first admin user (Windows)
├── frontend/                  # Angular 20 application
│   └── (see frontend/CLAUDE.md for detailed guidance)
└── ai/                        # AI services (Docker Compose setup)
    ├── docker-compose.yml    # Ollama + MCP server
    ├── mcp-server/           # Node.js MCP server implementation
    │   ├── index.js         # Main server (modular, well-documented)
    │   ├── package.json     # Dependencies
    │   └── Dockerfile       # Container config
    └── README.md            # Comprehensive AI services documentation
```

## Common Commands

### Backend Development

**Start all services:**
```bash
cd backend
docker-compose up -d              # Start PostgreSQL, PostgREST, Nginx
docker-compose logs -f            # View all logs
docker-compose logs -f postgres   # View specific service logs
```

**Stop services:**
```bash
docker-compose down               # Stop but keep data
docker-compose down -v            # Stop and DELETE all data (use carefully!)
```

**Database access:**
```bash
# Connect to PostgreSQL directly
docker exec -it postgres-blogdb psql -U admin -d blogdb

# Or use psql client
psql postgres://admin:password@localhost:5432/blogdb
```

**Create admin user:**
```bash
.\create-admin.cmd   # Windows
./create-admin.sh    # Linux/Mac
```

**Apply new migrations:**
Migrations in `backend/database/.migrations/` are auto-applied on first database init. For existing databases, run them manually via psql.

**Generate JWT secret:**
```bash
cd backend/backend/jwt
go run generate_secret.go
# Copy output to .env file
```

### Frontend Development

```bash
cd frontend
npm install                       # Install dependencies
npm start                         # Dev server on :4200
npm run build                     # Production build
npm test                          # Run unit tests with Karma
npm run deploy                    # Build and deploy to gh-pages
```

**Code generation:**
```bash
ng generate component component-name
ng generate --help                # List all schematics
```

### AI Services Development

**Start AI services:**
```bash
cd ai
cp .env.example .env              # Create env file (or symlink to backend/.env)
docker-compose up -d              # Start Ollama + MCP server
docker-compose logs -f            # View logs
```

**Test Ollama:**
```bash
# Test Ollama API directly
curl http://localhost:11434/api/generate -d '{"model":"tinyllama","prompt":"Hello","stream":false}'

# List available models
curl http://localhost:11434/api/tags
```

**MCP Server Tools:**
The MCP server provides 8 tools for Claude Code integration (see `ai/README.md` for details):
- Database queries (query_database, get_schema)
- AI queries (ai_query with Ollama)
- Blog tools (list_blog_posts, get_blog_post)
- Experience tools (list_experience, get_experience)
- User tools (list_users)

## Architecture

### Backend: PostgreSQL + PostgREST

**PostgREST** provides a RESTful API directly from PostgreSQL schema:
- Exposes `api` schema as REST endpoints
- JWT-based authentication via PostgreSQL roles
- No custom API server code needed

**Database schema (`api` schema):**
- `users` - User accounts (email, hashed password, role)
- `blog` - Blog posts (title, body, published, user_id, created_at)
- `experience` - Portfolio experience entries
- `files` - Binary file storage for images

**Role-based security:**
- `anon` role: Unauthenticated users (read-only access to blog/experience)
- `authenticated` role: Logged-in users (CRUD on blog/experience)
- `authenticator` role: PostgREST connects as this, switches roles per request based on JWT

**JWT authentication flow:**
1. Client calls `/rpc/login` with email/password
2. PostgreSQL function validates credentials and returns signed JWT
3. Client includes JWT in `Authorization: Bearer <token>` header
4. PostgREST validates JWT and switches to appropriate role
5. PostgreSQL enforces row-level permissions based on role

**Auto-set user_id pattern:**
Database triggers automatically extract `user_id` from JWT claims and set it on INSERT operations (see `001_user_relationships_and_triggers.sql`).

**Nginx proxy:**
Routes all API requests to PostgREST, handles CORS. Frontend calls API via `http://localhost:3000`.

### Frontend: Angular 20

Modern Angular with signals, zoneless change detection, and SSR. See `frontend/CLAUDE.md` for comprehensive frontend architecture details.

**Key integration points with backend:**
- API base URL in `src/environments/environment.ts`
- `AuthService` manages JWT token storage (localStorage, browser-only)
- `authInterceptor` adds Bearer token to all HTTP requests
- Auto-logout on 401 responses

### AI Services: MCP + Ollama

Separate AI stack for database queries enhanced with local LLM:

**Ollama Service:**
- Runs TinyLlama 1.1B model (smallest practical model, ~637MB)
- CPU-friendly, fast inference (2-5 tokens/sec)
- Upgradeable to larger models (qwen2.5, phi3)

**MCP Server (Node.js):**
- Model Context Protocol implementation
- Connects to PostgreSQL database (read-only by default)
- Integrates with Ollama for AI-enhanced responses
- Modular architecture in `ai/mcp-server/index.js`:
  - Configuration section (database + Ollama config)
  - Database connection pool
  - AI/Ollama functions (callOllama, getSchemaContext)
  - Database query functions (executeSafeQuery, listBlogPosts, listExperience, etc.)
  - MCP tool definitions (8 tools for various operations)
  - Tool handlers (organized by category: Database, AI, Blog, Experience, Users)
  - Server setup and startup

**MCP Tools organized by category:**
1. **Database Tools**: query_database, get_schema
2. **AI Tools**: ai_query (natural language queries with context)
3. **Blog Tools**: list_blog_posts, get_blog_post
4. **Experience Tools**: list_experience, get_experience
5. **User Tools**: list_users

The MCP server is designed to be easily extensible - add new tools by defining them in the TOOLS array and adding a handler in handleToolCall().

## Database Migrations

Migrations are numbered SQL files in `backend/database/.migrations/`:
- Naming: `001_description.sql`, `002_description.sql`, etc.
- Tracked in `_migrations` table
- Applied automatically on first container start (via Docker init scripts)
- For existing databases, manually run new migrations via psql

**View applied migrations:**
```sql
SELECT * FROM _migrations ORDER BY id;
```

**Manual migration application:**
```bash
docker exec -i postgres-blogdb psql -U admin -d blogdb < backend/database/.migrations/004_new_migration.sql
```

## Environment Configuration

Required `.env` file in `backend/` directory:
```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=blogdb
JWT_SECRET=generate_with_go_script
AUTHENTICATOR_PASSWORD=another_secure_password
```

Generate JWT_SECRET:
```bash
cd backend/backend/jwt && go run generate_secret.go
```

## API Endpoints

PostgREST automatically exposes these endpoints:
- `GET /blog` - List posts (public)
- `POST /blog` - Create post (requires auth)
- `PATCH /blog?id=eq.<id>` - Update post (requires auth)
- `DELETE /blog?id=eq.<id>` - Delete post (requires auth)
- `GET /experience` - List experience entries (public)
- `POST /rpc/login` - Login (returns JWT)
- `POST /rpc/upload_file` - Upload image (requires auth)
- `GET /rpc/file?file_id=<id>` - Retrieve image

## Development Workflow

**Full stack local development:**
1. Start backend: `cd backend && docker-compose up -d`
2. Create admin user: `.\create-admin.cmd`
3. Start frontend: `cd frontend && npm start`
4. Access app at `http://localhost:4200` (API at `http://localhost:3000`)

**Making schema changes:**
1. Create numbered migration file in `backend/database/.migrations/`
2. Either restart container (fresh DB) or apply manually (existing DB)
3. Update frontend TypeScript interfaces to match new schema

**Rebuild after changes:**
```bash
docker-compose up -d --build          # Rebuild all services
docker-compose up -d --build postgrest # Rebuild specific service
```

## Troubleshooting

**Database won't start:**
Check logs: `docker logs postgres-blogdb`

**PostgREST can't connect:**
- Verify `AUTHENTICATOR_PASSWORD` matches in `.env`
- Check: `docker logs postgrest-container`

**Frontend CORS errors:**
- Nginx handles CORS configuration
- Restart: `docker restart nginx-proxy`

**Fresh database reset:**
```bash
docker-compose down -v  # Deletes all data!
docker-compose up -d
.\create-admin.cmd
```

## Production Deployment

**Backend:**
- Use production-grade PostgreSQL passwords in `.env`
- Set up SSL with Let's Encrypt
- Configure production domain in Nginx config
- Use Docker Compose on production server

**Frontend:**
- Update `frontend/src/environments/environment.prod.ts` with production API URL
- Build: `cd frontend && npm run build`
- Deploy `dist/frontend/browser/` to static hosting or web server
