using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.MicrosoftAccount;

var builder = WebApplication.CreateBuilder(args);

// Add authentication services
builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
.AddCookie()
.AddGoogle(googleOptions =>
{
    googleOptions.ClientId = "YOUR_GOOGLE_CLIENT_ID";
    googleOptions.ClientSecret = "YOUR_GOOGLE_CLIENT_SECRET";
})
.AddMicrosoftAccount(microsoftOptions =>
{
    microsoftOptions.ClientId = "YOUR_MICROSOFT_CLIENT_ID";
    microsoftOptions.ClientSecret = "YOUR_MICROSOFT_CLIENT_SECRET";
});

var app = builder.Build();

// Enable authentication middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => "Hachi backend running!");

app.Run();