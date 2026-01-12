# b2 - Minimal .NET API

A minimal .NET API for JWT token validation.

## Environment Variables

- `JWT_SECRET`: HMAC secret for JWT validation (matches PostgREST).
- `N8N_WEBHOOK_URL`: Optional URL to POST user data to n8n webhook.
- `N8N_JWT_SECRET`: Secret for generating Bearer tokens to authenticate with n8n.

## Running

```bash
dotnet restore
dotnet run
```

## Endpoints

- `POST /ask`: Requires Bearer JWT and JSON body with "message". Returns authenticated user claims and echoes the message; triggers n8n webhook with {"message": <request message>} if configured.
