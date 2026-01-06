# Blog Platform - PostgreSQL + PostgREST + Angular

A full-stack blog application with PostgreSQL database, PostgREST API backend, Nginx proxy, and Angular frontend.

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js & npm (for frontend development)
- Go (for generating JWT secrets)

### 1. Environment Setup

Create a `.env` file in the project root:

```env
# PostgreSQL Database Configuration
POSTGRES_USER=admin
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=blogdb

# JWT Secret - Generate using: cd backend/jwt && go run generate_secret.go
JWT_SECRET=your_generated_jwt_secret_here

# Authenticator Password (used by PostgREST to connect)
AUTHENTICATOR_PASSWORD=your_authenticator_password_here
```

**Generate JWT Secret:**

```bash
cd backend/jwt
go run generate_secret.go
```

Copy the generated secret to your `.env` file.

### 2. Start Backend Services

```bash
# Start all backend services (PostgreSQL + PostgREST + Nginx)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services (keeps data)
docker-compose down

# Stop services and remove all data
docker-compose down -v
```

This starts:
- **PostgreSQL** on port `5432`
- **PostgREST** (internal, not exposed)
- **Nginx Proxy** on port `3000` (API gateway)

### 3. Create Admin User

Run the batch script to create your first admin user:

```bash
# Windows
.\create-admin.cmd

# Linux/Mac
./create-admin.sh
```

Follow the prompts to enter email and password.

### 4. Start Frontend (Development)

```bash
cd frontend
npm install
npm start
```

The Angular app will run on `http://localhost:4200`

### 5. Access the Application

- **Frontend:** http://localhost:4200
- **API:** http://localhost:3000
- **API Health Check:** http://localhost:3000/blog

## 📁 Project Structure

```
.
├── backend/
│   ├── jwt/                    # JWT token generation utilities
│   └── postgrest.conf          # PostgREST configuration (deprecated, uses env vars)
├── database/
│   ├── 00-setup.sql           # Initial database schema
│   ├── 01-set-password.sh     # Set authenticator password from env
│   └── .migrations/           # Database migrations
│       └── 002-add-images.sql # Image storage tables and functions
├── frontend/
│   ├── src/                   # Angular application source
│   └── package.json           # Frontend dependencies
├── docker-compose.yml         # Docker services configuration
├── nginx.conf                 # Nginx proxy configuration
├── Dockerfile                 # PostgREST container
├── Dockerfile.postgres        # PostgreSQL container
└── .env                       # Environment variables (not in git)
```

## 🗄️ Database Management

### Connect to PostgreSQL

```bash
# Using docker exec
docker exec -it postgres-blogdb psql -U admin -d blogdb

# Using psql client directly
psql postgres://admin:your_password@localhost:5432/blogdb
```

### Useful SQL Commands

```sql
-- List all tables
\dt api.*

-- Check users
SELECT id, email, role FROM api.users;

-- View blog posts
SELECT * FROM api.blog ORDER BY created_at DESC;

-- Exit psql
\q
```

### Database Schema

- **api.users** - User accounts (email, password hash, role)
- **api.blog** - Blog posts (title, body, user_id, created_at)
- **api.experience** - Experience entries (for portfolio)
- **api.files** - Image/file storage (blob, type, name)

### Migrations

Migrations are stored in `database/.migrations/` and run automatically on first database initialization. To apply new migrations to an existing database, you need to run them manually.

## 🔧 Development

### Rebuild Containers

```bash
# Rebuild after code changes
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build postgrest
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f postgres
docker-compose logs -f postgrest
docker-compose logs -f nginx
```

### Reset Database (Fresh Start)

```bash
# WARNING: This deletes all data!
docker-compose down -v
docker-compose up -d

# Then recreate admin user
.\create-admin.cmd
```

## 🔐 Authentication

The API uses JWT (JSON Web Token) authentication:

1. **Login:** POST to `/rpc/login` with email and password
2. **Receive JWT token** in response
3. **Include token** in subsequent requests: `Authorization: Bearer <token>`

### Example Login Request

```http
POST http://localhost:3000/rpc/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your_password"
}
```

## 📸 Image Upload

Images are stored as binary data in PostgreSQL:

- **Upload:** POST to `/rpc/upload_file` with base64 image data
- **Retrieve:** GET from `/rpc/file?file_id=<id>` or `/images?file_id=<id>`

The Angular frontend includes an image upload component integrated into the blog form.

## 🌐 Production Deployment

### Backend

1. Update `.env` with production credentials
2. Deploy using Docker Compose on your server
3. Set up SSL/HTTPS (use Let's Encrypt with Certbot)
4. Configure domain in `nginx.conf`

### Frontend

1. Update `frontend/src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://your-api-domain.com',
};
```

2. Build for production:
```bash
cd frontend
npm run build
```

3. Deploy `dist/frontend/browser/` to your web hosting

## 🛠️ Troubleshooting

### Database connection refused
```bash
# Check if PostgreSQL is running
docker ps
docker logs postgres-blogdb
```

### PostgREST can't connect
- Verify `AUTHENTICATOR_PASSWORD` in `.env` matches
- Check PostgREST logs: `docker logs postgrest-container`

### CORS errors
- Nginx is configured to handle CORS
- Restart nginx: `docker restart nginx-proxy`

### Lost data after restart
- Ensure volume is configured in `docker-compose.yml`
- Don't use `docker-compose down -v` unless you want to delete data

## 📝 API Endpoints

- `GET /blog` - List all blog posts
- `POST /blog` - Create new blog post (authenticated)
- `PATCH /blog?id=eq.<id>` - Update blog post (authenticated)
- `DELETE /blog?id=eq.<id>` - Delete blog post (authenticated)
- `GET /experience` - List experience entries
- `POST /rpc/login` - User login
- `POST /rpc/upload_file` - Upload image (authenticated)
- `GET /rpc/file?file_id=<id>` - Retrieve image
- `GET /images?file_id=<id>` - Retrieve image (alias)

## 📄 License

This project is for personal use.
