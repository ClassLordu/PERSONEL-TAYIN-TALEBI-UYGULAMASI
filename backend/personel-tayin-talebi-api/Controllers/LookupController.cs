using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using personel_tayin_talebi_api.Data;
using System.Linq;
using System.Threading.Tasks;

namespace personel_tayin_talebi_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LookupController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LookupController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("talep-turleri")]
        public async Task<IActionResult> GetTalepTurleri()
        {
            // "Eş Durumu", "Sağlık Mazereti" gibi türler farklı mantıklar gerektirebileceği için,
            // şimdilik sadece temel olanları döndürüyoruz. İhtiyaca göre genişletilebilir.
            var talepTurleri = await _context.TalepTurleri
                .Where(t => t.Ad == "İsteğe Bağlı" || t.Ad == "Zorunlu Hizmet")
                .ToListAsync();
            return Ok(talepTurleri);
        }
        
        [HttpGet("adliyeler")]
        public async Task<IActionResult> GetAdliyeler()
        {
            var adliyeler = await _context.Adliyeler.OrderBy(a => a.Ad).ToListAsync();
            return Ok(adliyeler);
        }
    }
} 