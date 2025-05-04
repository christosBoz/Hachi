using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.MicrosoftAccount;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;  // Add this line to use ClaimTypes
using Hachi.Data;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;  // Make sure this namespace is included
using Microsoft.EntityFrameworkCore;


namespace Hachi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
            public class AuthController : ControllerBase
        {
            private readonly HttpClient _httpClient;
            private readonly ILogger<AuthController> _logger;  // Inject ILogger here
            private readonly AppDbContext _context;


            public AuthController(HttpClient httpClient, ILogger<AuthController> logger, AppDbContext context)
            {
                _httpClient = httpClient;
                _logger = logger ?? throw new ArgumentNullException(nameof(logger)); // Ensure the logger is not null
                _context = context ?? throw new ArgumentNullException(nameof(context));

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
            _logger.LogInformation("Starting GoogleResponse");

            var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            if (!authenticateResult.Succeeded)
                return Unauthorized();

            var claims = authenticateResult.Principal?.Identities.FirstOrDefault()?.Claims;
            var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(email))
                return Unauthorized(new { message = "No email claim found" });

            // Call your DB to check if the user exists
            var response = await _httpClient.GetAsync($"http://localhost:5138/api/account/exists?email={email}");

            if (response.IsSuccessStatusCode)
            {
                // ✅ Fully registered user → sign them in with cookies
                var claimsIdentity = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Email, email)
                }, CookieAuthenticationDefaults.AuthenticationScheme);

                var principal = new ClaimsPrincipal(claimsIdentity);
                await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

                return Redirect("http://localhost:3000/test");
            }

            // ❌ Not fully registered → no cookie login yet
            // → Set temp cookie or session
            Response.Cookies.Append("pre_signup_email", email, new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.None,
                Secure = true
            });

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
        [HttpGet("check-pre-signup")]
        public IActionResult CheckPreSignup()
        {
            var email = Request.Cookies["pre_signup_email"];
            if (string.IsNullOrEmpty(email))
                return Unauthorized(new { message = "No signup session." });

            return Ok(new { email });
        }
        [Authorize]
        [HttpGet("validate")]
        public async Task<IActionResult> Validate()
        {
            var email = User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(email))
                return Unauthorized(new { message = "No session" });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null || string.IsNullOrEmpty(user.Username) || user.Birthday == null || user.SchoolId == 0)
            {
                // ❌ Not a valid user → log out
                await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
                return Unauthorized(new { message = "Incomplete profile — signed out" });
            }

            return Ok(new
            {
                user = new
                {
                    user.UserId,
                    user.Email,
                    user.Username,
                    user.School,
                    user.Birthday
                },
                profileComplete = true
            });
        }


    }
}
