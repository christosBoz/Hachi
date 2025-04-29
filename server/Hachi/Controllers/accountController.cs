using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using Hachi.Data;
using Microsoft.Extensions.Logging;  // This namespace is required for logging

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
            if (model == null)
            {
                _logger.LogWarning("Profile data is missing.");
                return BadRequest(new { message = "Profile data is missing." });
            }

            if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Birthday) || string.IsNullOrEmpty(model.School))
            {
                _logger.LogWarning("Missing required profile fields.");
                return BadRequest(new { message = "All fields (Username, Birthday, and School) are required." });
            }

            // Convert the birthday string to DateTime? (nullable DateTime)
            DateTime? parsedBirthday = null;
            if (!string.IsNullOrEmpty(model.Birthday) && DateTime.TryParse(model.Birthday, out DateTime result))
            {
                parsedBirthday = DateTime.SpecifyKind(result, DateTimeKind.Utc);  // Ensure Birthday is in UTC
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.UserId.ToString() == userId);

            if (existingUser != null)
            {
                existingUser.Username = model.Username;
                existingUser.Birthday = parsedBirthday ?? existingUser.Birthday;
                existingUser.School = model.School;
                existingUser.AvatarChoice = model.AvatarChoice ?? "default";  // Set default avatar if not provided
                
                _context.Users.Update(existingUser);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Profile updated successfully.", user = existingUser });
            }
            else
            {
                var newUser = new User
                {
                    UserId = Guid.NewGuid(),
                    Email = User.FindFirst(ClaimTypes.Email)?.Value,
                    Username = model.Username,
                    Birthday = parsedBirthday,  // Store UTC birthday
                    School = model.School,
                    AccountCreationDate = DateTime.UtcNow,  // Use UTC for account creation date
                    AvatarChoice = model.AvatarChoice ?? "default"  // Set default avatar if not provided
                };

                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Profile created successfully.", user = newUser });
            }
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

            user.School = model.School ?? user.School;
            user.AvatarChoice = model.AvatarChoice ?? user.AvatarChoice;

            // Save changes to the database
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Profile updated successfully." });
        }


        // Check if the user exists in the database (after OAuth login)
        [HttpGet("exists")]
        public async Task<IActionResult> CheckUserExists()
        {
            // Log the start of the method
            _logger.LogInformation("Starting CheckUserExists method.");

            var email = User.FindFirst(ClaimTypes.Email)?.Value;
            
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
                return Ok(new { message = "User does not exist, please complete your profile." });
            }

            // If user exists, log the user information (be mindful of logging sensitive data like passwords)
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
    }
}
