using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hachi.Data;
// using Hachi.Models;

namespace Hachi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SchoolsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SchoolsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/schools/search?query=harv
        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Missing search query.");

            var results = await _context.Schools
                .Where(s => EF.Functions.ILike(s.Name, $"%{query}%"))
                .OrderBy(s => s.Name)
                .Take(10)
                .Select(s => new { s.Name })
                .ToListAsync();

            return Ok(results);
        }
    }
}
