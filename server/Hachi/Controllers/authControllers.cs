using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.MicrosoftAccount;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;  // Add this line to use ClaimTypes
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;  // Make sure this namespace is included

namespace Hachi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
            public class AuthController : ControllerBase
        {
            private readonly HttpClient _httpClient;
            private readonly ILogger<AuthController> _logger;  // Inject ILogger here

            public AuthController(HttpClient httpClient, ILogger<AuthController> logger)
            {
                _httpClient = httpClient;
                _logger = logger ?? throw new ArgumentNullException(nameof(logger)); // Ensure the logger is not null
            }


        [HttpGet("login/google")]
        public IActionResult GoogleLogin()
        {
            var properties = new AuthenticationProperties
            {
                RedirectUri = Url.Action(nameof(GoogleResponse))
            };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("login/microsoft")]
        public IActionResult MicrosoftLogin()
        {
            var properties = new AuthenticationProperties
            {
                RedirectUri = Url.Action(nameof(MicrosoftResponse))
            };
            return Challenge(properties, MicrosoftAccountDefaults.AuthenticationScheme);
        }

        [HttpGet("GoogleResponse")]
    public async Task<IActionResult> GoogleResponse()
    {
        // Log the start of the method
        _logger.LogInformation("Starting GoogleResponse method.");

        var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        if (!authenticateResult.Succeeded)
            return Unauthorized();

        var claims = authenticateResult.Principal?.Identities.FirstOrDefault()?.Claims;
        var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

        if (string.IsNullOrEmpty(email))
        {
            _logger.LogWarning("No email claim found for the user.");
            return Unauthorized(new { message = "No email claim found" });
        }

        _logger.LogInformation("Email found: {Email}", email);

        // Make an internal API call to check if the user exists
        var userExistsResponse = await _httpClient.GetAsync($"http://localhost:5138/api/account/exists?email={email}");

        if (userExistsResponse.IsSuccessStatusCode)
        {
            return Redirect("http://localhost:3000/test");
        }

        return Redirect("http://localhost:3000/fsu");
    }

    [HttpGet("MicrosoftResponse")]
    public async Task<IActionResult> MicrosoftResponse()
    {
        // Log the start of the method
        _logger.LogInformation("Starting MicrosoftResponse method.");

        var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        if (!authenticateResult.Succeeded)
            return Unauthorized();

        var claims = authenticateResult.Principal?.Identities.FirstOrDefault()?.Claims;
        var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

        if (string.IsNullOrEmpty(email))
        {
            _logger.LogWarning("No email claim found for the user.");
            return Unauthorized(new { message = "No email claim found" });
        }

        _logger.LogInformation("Email found: {Email}", email);

        // Make an internal API call to check if the user exists
        var userExistsResponse = await _httpClient.GetAsync($"http://localhost:5138/api/account/exists?email={email}");

        if (userExistsResponse.IsSuccessStatusCode)
        {
            return Redirect("http://localhost:3000/test");
        }

        return Redirect("http://localhost:3000/fsu");
    }

        [Authorize]
        [HttpGet("profile")]
        public IActionResult Profile()
        {
            var claims = User.Claims.Select(c => new { c.Type, c.Value });
            return Ok(claims);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { message = "Logged out" });
        }
    }
}
