using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using personel_tayin_talebi_api.Data;
using System.Linq;
using System.Threading.Tasks;

namespace personel_tayin_talebi_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TalepTurleriController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TalepTurleriController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/TalepTurleri
        [HttpGet]
        public async Task<IActionResult> GetTalepTurleri()
        {
            var talepTurleri = await _context.TalepTurleri.OrderBy(t => t.Ad).ToListAsync();
            return Ok(talepTurleri);
        }
    }
} 