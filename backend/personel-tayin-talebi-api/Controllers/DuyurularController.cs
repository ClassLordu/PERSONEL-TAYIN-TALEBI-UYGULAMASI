using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using personel_tayin_talebi_api.Data;
using personel_tayin_talebi_api.Models;
using System.Linq;
using System.Threading.Tasks;

namespace personel_tayin_talebi_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DuyurularController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DuyurularController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetDuyurular()
        {
            var duyurular = await _context.Duyurular
                .Where(d => d.AktifMi)
                .OrderByDescending(d => d.YayinTarihi)
                .ToListAsync();
            return Ok(duyurular);
        }

        [HttpGet("all")]
        [Authorize(Roles = "Yetkili")]
        public async Task<IActionResult> GetAllDuyurular()
        {
            var duyurular = await _context.Duyurular
                .OrderByDescending(d => d.YayinTarihi)
                .ToListAsync();
            return Ok(duyurular);
        }

        [HttpPost]
        [Authorize(Roles = "Yetkili")]
        public async Task<IActionResult> CreateDuyuru([FromBody] DuyuruCreateDto duyuruDto)
        {
            var yeniDuyuru = new Duyuru
            {
                Baslik = duyuruDto.Baslik,
                Icerik = duyuruDto.Icerik,
                YayinTarihi = System.DateTime.UtcNow,
                AktifMi = duyuruDto.AktifMi
            };
            
            _context.Duyurular.Add(yeniDuyuru);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDuyurular), new { id = yeniDuyuru.Id }, yeniDuyuru);
        }
        
        [HttpPut("{id}")]
        [Authorize(Roles = "Yetkili")]
        public async Task<IActionResult> UpdateDuyuru(int id, Duyuru duyuru)
        {
            if (id != duyuru.Id)
            {
                return BadRequest();
            }
            _context.Entry(duyuru).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}/toggle-status")]
        [Authorize(Roles = "Yetkili")]
        public async Task<IActionResult> ToggleDuyuruStatus(int id)
        {
            var duyuru = await _context.Duyurular.FindAsync(id);
            if (duyuru == null)
            {
                return NotFound();
            }
            duyuru.AktifMi = !duyuru.AktifMi;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Yetkili")]
        public async Task<IActionResult> DeleteDuyuru(int id)
        {
            var duyuru = await _context.Duyurular.FindAsync(id);
            if (duyuru == null)
            {
                return NotFound();
            }
            _context.Duyurular.Remove(duyuru);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public class DuyuruCreateDto
    {
        public string Baslik { get; set; }
        public string Icerik { get; set; }
        public bool AktifMi { get; set; }
    }
} 