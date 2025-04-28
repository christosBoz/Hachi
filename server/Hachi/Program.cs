using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.MicrosoftAccount;
using DotNetEnv;
Env.Load("../../.env"); ; // this loads the .env file
var builder = WebApplication.CreateBuilder(args);

// Load environment variables
builder.Configuration.AddEnvironmentVariables();

// Read secrets from environment variables or appsettings.json fallback
var googleClientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID") ?? builder.Configuration["Authentication:Google:ClientId"];
var googleClientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET") ?? builder.Configuration["Authentication:Google:ClientSecret"];

var microsoftClientId = Environment.GetEnvironmentVariable("MICROSOFT_CLIENT_ID") ?? builder.Configuration["Authentication:Microsoft:ClientId"];
var microsoftClientSecret = Environment.GetEnvironmentVariable("MICROSOFT_CLIENT_SECRET") ?? builder.Configuration["Authentication:Microsoft:ClientSecret"];

// Add services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

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
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };
})
.AddGoogle(googleOptions =>
{
    googleOptions.ClientId = googleClientId!;
    googleOptions.ClientSecret = googleClientSecret!;
})
.AddMicrosoftAccount(microsoftOptions =>
{
    microsoftOptions.ClientId = microsoftClientId!;
    microsoftOptions.ClientSecret = microsoftClientSecret!;
});
.AddFacebook(facebookOptions =>
{
    facebookOptions.AppId = builder.Configuration["FACEBOOK_APP_ID"]!;
    facebookOptions.AppSecret = builder.Configuration["FACEBOOK_APP_SECRET"]!;
});
builder.Services.AddAuthorization();
builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
