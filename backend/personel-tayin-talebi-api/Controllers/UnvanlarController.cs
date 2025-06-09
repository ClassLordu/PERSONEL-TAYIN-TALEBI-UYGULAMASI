using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using personel_tayin_talebi_api.Data;
using System.Linq;
using System.Threading.Tasks;

namespace personel_tayin_talebi_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UnvanlarController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UnvanlarController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Unvanlar
        [HttpGet]
        public async Task<IActionResult> GetUnvanlar()
        {
            var unvanlar = await _context.Unvanlar.OrderBy(u => u.Ad).ToListAsync();
            return Ok(unvanlar);
        }
    }
} 