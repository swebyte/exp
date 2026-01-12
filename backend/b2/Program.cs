using System.Text;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

DotNetEnv.Env.Load("../.env");

var builder = WebApplication.CreateBuilder(args);

var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET");
if (string.IsNullOrEmpty(jwtSecret))
{
    Console.WriteLine("Warning: JWT_SECRET is not set. Token validation will fail without a secret.");
}

var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret ?? ""));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = signingKey,
            ValidateLifetime = true
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/ask", (HttpContext http) =>
{
    var user = http.User;
    var claims = user.Claims.Select(c => new { c.Type, c.Value });
    return Results.Ok(new { authenticated = user.Identity?.IsAuthenticated, claims });
}).RequireAuthorization();

app.Run();
