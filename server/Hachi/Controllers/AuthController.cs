using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Http;
using System.Net.Http;
using Newtonsoft.Json;
using Hachi.Data;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IHttpClientFactory _httpClientFactory;

    private const string COGNITO_DOMAIN = "https://us-east-2qnjhtqnac.auth.us-east-2.amazoncognito.com";
    private const string JWKS_URL = "https://cognito-idp.us-east-2.amazonaws.com/us-east-2_qNjhtqnaC/.well-known/jwks.json";
    private const string AUDIENCE = "cvprj4cqhl4h6kjsaaem962jf";

    public AuthController(AppDbContext db, IHttpClientFactory httpClientFactory)
    {
        _db = db;
        _httpClientFactory = httpClientFactory;
    }

    [HttpPost("callback")]
    public async Task<IActionResult> Callback([FromBody] TokenDto dto)
    {
        var idToken = dto.IdToken;
        var accessToken = dto.AccessToken;

        var handler = new JwtSecurityTokenHandler();
        var keys = await GetSigningKeys();
        var validationParams = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "https://cognito-idp.us-east-2.amazonaws.com/us-east-2_qNjhtqnaC", // ✅ correct this
            ValidateAudience = true,
            ValidAudience = "cvprj4cqhl4h6kjsaaem962jf",
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKeys = keys
        };

        ClaimsPrincipal principal;
        try
        {
            principal = handler.ValidateToken(idToken, validationParams, out _);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Token validation failed: {ex.Message}");
            return Unauthorized();
        }

        // Try to get email from token first
        var email = principal.FindFirst(ClaimTypes.Email)?.Value;

        // Fallback to /userinfo if email not present
        if (string.IsNullOrEmpty(email))
        {
            email = await GetEmailFromUserInfo(accessToken);
            if (string.IsNullOrEmpty(email))
                return Unauthorized(new { message = "Could not extract email from token or userinfo." });
        }

        var exists = await _db.Users.AnyAsync(u => u.Email == email);

        // Store access_token in secure HttpOnly cookie
        Response.Cookies.Append("access_token", idToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddHours(1)
        });

        // If user doesn't exist yet, store temporary cookie to support account completion
        if (!exists)
        {
            Response.Cookies.Append("pre_signup_email", email, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddMinutes(15)
            });
        }

        return Ok(new
        {
            message = exists ? "User exists" : "User does not exist, please complete your profile",
            email,
            exists
        });
    }

    [HttpGet("check-pre-signup")]
    public async Task<IActionResult> CheckPreSignup()
    {
        var token = Request.Cookies["access_token"];
        if (string.IsNullOrEmpty(token))
            return Unauthorized(new { message = "Missing token" });

        var handler = new JwtSecurityTokenHandler();
        var keys = await GetSigningKeys();

        try
        {
            var principal = handler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = JWKS_URL.Replace("/.well-known/jwks.json", ""),
                ValidateAudience = true,
                ValidAudience = AUDIENCE,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKeys = keys
            }, out _);

            var email = principal.FindFirst(ClaimTypes.Email)?.Value;
            if (email == null)
                return Unauthorized(new { message = "Email not found in token" });

            var exists = await _db.Users.AnyAsync(u => u.Email == email);

            return Ok(new { email, exists });
        }
        catch
        {
            return Unauthorized(new { message = "Token invalid or expired" });
        }
    }

    private async Task<IEnumerable<SecurityKey>> GetSigningKeys()
    {
        var client = _httpClientFactory.CreateClient();
        var res = await client.GetStringAsync(JWKS_URL);
        var jwks = JsonConvert.DeserializeObject<JsonWebKeySet>(res);
        return jwks.Keys;
    }

    private async Task<string> GetEmailFromUserInfo(string accessToken)
    {
        try
        {
            var client = _httpClientFactory.CreateClient();
            var req = new HttpRequestMessage(HttpMethod.Get, $"{COGNITO_DOMAIN}/oauth2/userInfo");
            req.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

            var res = await client.SendAsync(req);
            res.EnsureSuccessStatusCode();

            var json = await res.Content.ReadAsStringAsync();
            var obj = JsonConvert.DeserializeObject<Dictionary<string, object>>(json);

            return obj.TryGetValue("email", out var emailObj) ? emailObj?.ToString() : null;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to fetch userInfo: {ex.Message}");
            return null;
        }
    }
}
