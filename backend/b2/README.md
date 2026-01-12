# b2 - Minimal .NET API

A minimal .NET API for JWT token validation.

## Environment Variables

- `JWT_SECRET`: HMAC secret for JWT validation (matches PostgREST).

## Running

```bash
dotnet restore
dotnet run
```

## Endpoints

- `GET /ask`: Requires Bearer JWT; returns authenticated user claims.
