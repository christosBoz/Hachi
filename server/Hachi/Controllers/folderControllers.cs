using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using Hachi.Data;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Logging;

namespace Hachi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FolderController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<FolderController> _logger;
        private readonly IAmazonS3 _s3Client;

        public FolderController(AppDbContext context, ILogger<FolderController> logger, IAmazonS3 s3Client)
        {
            _context = context;
            _logger = logger;
            _s3Client = s3Client;
        }

        [HttpPost("create-folder")]
        public async Task<IActionResult> CreateFolder([FromForm] NewFolderRequest model)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId.ToString() == userId);
            if (user == null)
                return NotFound(new { message = "User not found." });

            string? imageUrl = null;

            if (model.File != null && model.File.Length > 0)
            {
                try
                {
                    // Get file extension from uploaded file (e.g. .png, .jpg)
                    var fileExtension = Path.GetExtension(model.File.FileName);
                    var randomName = $"{Guid.NewGuid()}{fileExtension}";
                    var s3Path = $"uploads/folders/{randomName}";

                    using var stream = model.File.OpenReadStream();

                    var putRequest = new PutObjectRequest
                    {
                        BucketName = "hachi-user-assets",
                        Key = s3Path,
                        InputStream = stream,
                        ContentType = model.File.ContentType
                        // CannedACL removed: if your bucket has ACLs disabled
                    };

                    await _s3Client.PutObjectAsync(putRequest);
                    imageUrl = $"https://hachi-user-assets.s3.amazonaws.com/{s3Path}";
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Image upload to S3 failed.");
                    return StatusCode(500, "Image upload failed.");
                }
            }

            var folder = new Folder
            {
                Name = model.Name,
                PictureUrl = imageUrl,
                IsSchool = model.IsSchool,
                CourseCode = model.CourseCode,
                School = model.School,
                UserId = user.UserId
            };

            _context.Folders.Add(folder);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Folder created successfully", folder });
        }

        [HttpGet("my-folders")]
        public async Task<IActionResult> GetUserFolders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var userGuid = Guid.Parse(userId);

            var folders = await _context.Folders
                .Where(f => f.UserId == userGuid)
                .Select(f => new
                {
                    f.FolderId,
                    f.Name,
                    f.PictureUrl,
                    f.CourseCode,
                    f.School
                })
                .ToListAsync();

            return Ok(folders);
        }


    }
}
