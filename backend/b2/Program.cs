using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;

using B2;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

DotNetEnv.Env.Load(".env");

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
builder.Services.AddHttpClient();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/ping", () => Results.Ok("pong"));

app.MapPost("/ask", async (AskRequest request, HttpContext http, IHttpClientFactory httpClientFactory) =>
{
    try
    {
        var user = http.User;
        var userId = user.FindFirst("user_id")?.Value;
        var n8nWebhookUrl = Environment.GetEnvironmentVariable("N8N_WEBHOOK_URL");
        if (string.IsNullOrEmpty(n8nWebhookUrl))
        {
            return Results.BadRequest("N8N_WEBHOOK_URL not configured");
        }

        var client = httpClientFactory.CreateClient();
        var n8nSecret = Environment.GetEnvironmentVariable("N8N_JWT_SECRET");
        if (!string.IsNullOrEmpty(n8nSecret))
        {
            var n8nSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(n8nSecret));
            var credentials = new SigningCredentials(n8nSigningKey, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                claims: new[] { new Claim("role", "service"), new Claim("user_id", userId ?? "") },
                expires: DateTime.Now.AddMinutes(5),
                signingCredentials: credentials
            );
            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenString);
        }
        var payload = new { message = request.Message };
        var response = await client.PostAsJsonAsync(n8nWebhookUrl, payload);
        if (response.IsSuccessStatusCode)
        {
            var result = await response.Content.ReadFromJsonAsync<object>();
            return Results.Ok(result);
        }
        else
        {
            // Capture more details for debugging: status, reason, and response body
            var status = (int)response.StatusCode;
            var reason = response.ReasonPhrase;
            string body = null;
            try
            {
                body = await response.Content.ReadAsStringAsync();
            }
            catch (Exception readEx)
            {
                body = $"<failed to read body: {readEx.Message}>";
            }

            var message = $"n8n returned {status} {reason}. Response body: {body}";
            Console.WriteLine(message);
            return Results.BadRequest(message);
        }
    }
    catch (Exception ex)
    {
        return Results.BadRequest($"Error: {ex.Message}");
    }
}).RequireAuthorization();

app.Run();
