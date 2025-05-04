using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using Hachi.Data;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc.ModelBinding;  // This namespace is required for logging

namespace Hachi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AccountController> _logger;  // Injecting ILogger

        // Constructor where ILogger is injected
        public AccountController(AppDbContext context, ILogger<AccountController> logger)
        {
            _context = context;
            _logger = logger;  // Initialize logger via DI
        }

        // Handle Google login response
        [HttpGet("GoogleResponse")]
        public async Task<IActionResult> GoogleResponse()
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            if (!authenticateResult.Succeeded)
                return Unauthorized();

            var claims = authenticateResult.Principal?.Identities.FirstOrDefault()?.Claims;
            var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            // Check if the email exists in the OAuth table
            var oauthRecord = await _context.OAuth.FirstOrDefaultAsync(o => o.ProviderEmail == email);
            
            if (oauthRecord != null)
            {
                // If the user exists in OAuth, get the UserId
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserId == oauthRecord.UserId);
                
                if (user != null)
                {
                    // If user exists, return profile data
                    return Ok(new { message = "User found", user });
                }
            }

            // If user does not exist, redirect to profile completion form
            return NotFound(new { message = "User not found, please complete your profile." });
        }

        // Handle Microsoft login response
        [HttpGet("MicrosoftResponse")]
        public async Task<IActionResult> MicrosoftResponse()
        {
            var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            if (!authenticateResult.Succeeded)
                return Unauthorized();

            var claims = authenticateResult.Principal?.Identities.FirstOrDefault()?.Claims;
            var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            // Check if the email exists in the OAuth table
            var oauthRecord = await _context.OAuth.FirstOrDefaultAsync(o => o.ProviderEmail == email);
            
            if (oauthRecord != null)
            {
                // If the user exists in OAuth, get the UserId
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserId == oauthRecord.UserId);
                
                if (user != null)
                {
                    // If user exists, return profile data
                    return Ok(new { message = "User found", user });
                }
            }

            // If user does not exist, redirect to profile completion form
            return NotFound(new { message = "User not found, please complete your profile." });
        }

        // Profile completion form (GET)
        // Profile completion form (POST)
       [HttpPost("complete-profile")]
        public async Task<IActionResult> CompleteProfile([FromBody] UserProfileUpdateRequest model)
        {
            var email = Request.Cookies["pre_signup_email"];
            if (string.IsNullOrEmpty(email))
                return Unauthorized(new { message = "Session expired or invalid." });

            // Validation...
            if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Birthday) || model.SchoolId == 0)
            {
                return BadRequest(new { message = "All fields are required." });
            }

            var parsedBirthday = DateTime.TryParse(model.Birthday, out var result)
                ? DateTime.SpecifyKind(result, DateTimeKind.Utc)
                : (DateTime?)null;

            var newUser = new User
            {
                UserId = Guid.NewGuid(),
                Email = email,
                Username = model.Username,
                Birthday = parsedBirthday,
                SchoolId = model.SchoolId,
                AccountCreationDate = DateTime.UtcNow,
                AvatarChoice = model.AvatarChoice ?? "default",
                Teacher = model.Teacher ?? false,
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            // ✅ Now sign them in
            var claimsIdentity = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.NameIdentifier, newUser.UserId.ToString())
            }, CookieAuthenticationDefaults.AuthenticationScheme);

            var principal = new ClaimsPrincipal(claimsIdentity);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            Response.Cookies.Delete("pre_signup_email");

            return Ok(new { message = "Profile completed and signed in.", user = newUser });
        }




        // Edit profile (POST)
        [HttpPost("edit-profile")]
        public async Task<IActionResult> EditProfile([FromBody] UserProfileUpdateRequest model) 
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            // Find the user by userId (ensure user exists)
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId.ToString() == userId);

            if (user == null)
                return NotFound(new { message = "User not found." });

            // Convert the birthday string to DateTime? (nullable DateTime)
            DateTime? parsedBirthday = null;
            if (!string.IsNullOrEmpty(model.Birthday) && DateTime.TryParse(model.Birthday, out DateTime result))
            {
                parsedBirthday = result;
            }

            // Update the profile fields
            user.Username = model.Username ?? user.Username;

            // Use the parsed birthday or keep the existing one if invalid
            user.Birthday = parsedBirthday ?? user.Birthday;

            // user.School = model.School ?? user.School;
            user.AvatarChoice = model.AvatarChoice ?? user.AvatarChoice;

            // Save changes to the database
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Profile updated successfully." });
        }


        // Check if the user exists in the database (after OAuth login)
        [HttpGet("exists")]
        public async Task<IActionResult> CheckUserExists([FromQuery] string email)
        {
            // Log the start of the method
            _logger.LogInformation("Starting CheckUserExists method.");

            if (string.IsNullOrEmpty(email))
            {
                email = User.FindFirst(ClaimTypes.Email)?.Value; // Try to extract from the user's claims if not passed as query param
            }

            // Log email extraction step
            if (email == null)
            {
                _logger.LogWarning("No email claim found for the user.");
                return Unauthorized();
            }
            else
            {
                _logger.LogInformation("Email found: {Email}", email); // Log the email found
            }

            // Log the database query step
            _logger.LogInformation("Querying the database for the user with email: {Email}", email);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            // Check if the user exists
            if (user == null)
            {
                _logger.LogInformation("No user found with email: {Email}", email);
                return NotFound(new { message = "User does not exist, please complete your profile." });
            }

            // If user exists, log the user information
            _logger.LogInformation("User found: {Username}", user.Username);

            return Ok(new { message = "User exists", user });
        }


        [HttpGet("check-username/{username}")]
        public async Task<IActionResult> CheckUsername(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (user != null)
            {
                return Ok(new { message = "Username already taken" });
            }

            return Ok(new { message = "Username is available" });
        }

        [HttpGet("profile")]
public async Task<IActionResult> Profile()
{
    var email = User.FindFirst(ClaimTypes.Email)?.Value;

    if (email == null)
    {
        return Unauthorized(new { message = "User is not authenticated." });
    }

    // Find the user by email
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

    if (user == null)
    {
        return NotFound(new { message = "User not found." });
    }

    // Return the user data
    return Ok(new { user });
}

    }
}
