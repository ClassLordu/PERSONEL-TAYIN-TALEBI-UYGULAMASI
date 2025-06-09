using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using personel_tayin_talebi_api.Data;
using personel_tayin_talebi_api.Models;

namespace personel_tayin_talebi_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdliyelerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdliyelerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Adliyeler
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Adliye>>> GetAdliyeler()
        {
            return await _context.Adliyeler.ToListAsync();
        }

        // GET: api/Adliyeler/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Adliye>> GetAdliye(int id)
        {
            var adliye = await _context.Adliyeler.FindAsync(id);

            if (adliye == null)
            {
                return NotFound();
            }

            return adliye;
        }
    }
} 