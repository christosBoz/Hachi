using System.Text.Json;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.MicrosoftAccount;
using Microsoft.EntityFrameworkCore;
using Hachi.Data;
using DotNetEnv;
using Serilog;
using Hachi.Controllers;
using System.Security.Claims;
using System.Net.Http;

Env.Load("../../.env");  // This loads the .env file (if you have environment variables in a .env file)

var builder = WebApplication.CreateBuilder(args);

// Load environment variables
builder.Configuration.AddEnvironmentVariables();

// Configure Serilog for logging to both console and a file
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()  // Log to console
    .WriteTo.File("Logs/myapp.txt", rollingInterval: RollingInterval.Day)  // Log to a file (daily rollover)
    .CreateLogger();

// Register logging services
builder.Logging.AddSerilog();

// Add services to the container

// Register the database context (AppDbContext) with Npgsql
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS policy to allow frontend access from localhost:3000
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("http://localhost:3000")  // Your frontend URL
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();  // Allow credentials (cookies, etc.)
    });
});

builder.Services.AddHttpClient(); // Add this line to register HttpClient

// Authentication setup (Google & Microsoft OAuth)
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
.AddCookie(options =>
{
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = CookieSecurePolicy.None;
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401;  // Send a 401 Unauthorized status on redirect
        return Task.CompletedTask;
    };
})
.AddGoogle(googleOptions =>
{
    googleOptions.ClientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");
    googleOptions.ClientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET");
    googleOptions.Scope.Add("email");  // Add email scope to request email claim
    googleOptions.SaveTokens = true;  // Save tokens in the cookie
    googleOptions.Events.OnCreatingTicket = context =>
    {
        // Ensure that the email claim is added
        var email = context.User.GetProperty("email").GetString();  // Extract email correctly from JsonElement
        context.Identity.AddClaim(new Claim(ClaimTypes.Email, email));
        return Task.CompletedTask;
    };
})
.AddMicrosoftAccount(microsoftOptions =>
{
    microsoftOptions.ClientId = Environment.GetEnvironmentVariable("MICROSOFT_CLIENT_ID");
    microsoftOptions.ClientSecret = Environment.GetEnvironmentVariable("MICROSOFT_CLIENT_ID");
    microsoftOptions.Scope.Add("email");  // Add email scope to request email claim
    microsoftOptions.SaveTokens = true;  // Save tokens in the cookie
    microsoftOptions.Events.OnCreatingTicket = context =>
    {
        // Ensure that the email claim is added
        var email = context.User.GetProperty("email").GetString();  // Extract email correctly from JsonElement
        context.Identity.AddClaim(new Claim(ClaimTypes.Email, email));
        return Task.CompletedTask;
    };
});

// Add authorization services
builder.Services.AddAuthorization();

// Add controller services
builder.Services.AddControllers();

builder.Services.AddHttpClient<AuthController>(); // Add this line to register HttpClient for AuthController

var app = builder.Build();

// Use CORS policy
app.UseCors("AllowAll");

// Use authentication and authorization middleware
app.UseAuthentication();
app.UseAuthorization();

// Ensure controllers are mapped
app.MapControllers();

// Run the application
app.Run();
