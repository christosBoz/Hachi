using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.MicrosoftAccount;
using Microsoft.EntityFrameworkCore;
using Hachi.Data;
using DotNetEnv;
using Serilog;

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
    googleOptions.ClientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID") ?? builder.Configuration["Authentication:Google:ClientId"];
    googleOptions.ClientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET") ?? builder.Configuration["Authentication:Google:ClientSecret"];
})
.AddMicrosoftAccount(microsoftOptions =>
{
    microsoftOptions.ClientId = Environment.GetEnvironmentVariable("MICROSOFT_CLIENT_ID") ?? builder.Configuration["Authentication:Microsoft:ClientId"];
    microsoftOptions.ClientSecret = Environment.GetEnvironmentVariable("MICROSOFT_CLIENT_SECRET") ?? builder.Configuration["Authentication:Microsoft:ClientSecret"];
});

// Add authorization services
builder.Services.AddAuthorization();

// Add controller services
builder.Services.AddControllers();

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
