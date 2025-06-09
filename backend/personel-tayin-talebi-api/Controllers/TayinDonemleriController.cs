using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using personel_tayin_talebi_api.Data;
using personel_tayin_talebi_api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace personel_tayin_talebi_api.Controllers
{
    // DTO (Data Transfer Object) for creating a new TayinDonemi
    public class TayinDonemiCreateDto
    {
        public string Ad { get; set; }
        public DateTime BaslangicTarihi { get; set; }
        public DateTime BitisTarihi { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TayinDonemleriController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TayinDonemleriController(ApplicationDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Yetkili")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TayinDonemi>>> GetTayinDonemleri()
        {
            return await _context.TayinDonemleri.OrderByDescending(d => d.BaslangicTarihi).ToListAsync();
        }

        // GET: api/TayinDonemleri/aktif
        [AllowAnonymous]
        [HttpGet("aktif")]
        public async Task<ActionResult<TayinDonemi>> GetAktifTayinDonemi()
        {
            var simdi = DateTime.UtcNow;
            var aktifDonem = await _context.TayinDonemleri
                .FirstOrDefaultAsync(d => d.BaslangicTarihi <= simdi && d.BitisTarihi >= simdi);

            if (aktifDonem == null)
            {
                return NoContent(); // Aktif dönem yoksa 204 No Content dönebiliriz.
            }

            return Ok(aktifDonem);
        }

        // GET: api/TayinDonemleri/5
        [Authorize(Roles = "Yetkili")]
        [HttpGet("{id}")]
        public async Task<ActionResult<TayinDonemi>> GetTayinDonemi(int id)
        {
            var tayinDonemi = await _context.TayinDonemleri.FindAsync(id);
            if (tayinDonemi == null)
            {
                return NotFound();
            }
            return tayinDonemi;
        }

        [Authorize(Roles = "Yetkili")]
        [HttpPost]
        public async Task<IActionResult> CreateTayinDonemi(TayinDonemiCreateDto tayinDonemiDto)
        {
            if (tayinDonemiDto.BaslangicTarihi >= tayinDonemiDto.BitisTarihi)
            {
                return BadRequest("Başlangıç tarihi, bitiş tarihinden önce olmalıdır.");
            }

            var tayinDonemi = new TayinDonemi
            {
                Ad = tayinDonemiDto.Ad,
                BaslangicTarihi = tayinDonemiDto.BaslangicTarihi,
                BitisTarihi = tayinDonemiDto.BitisTarihi,
                AktifMi = DateTime.UtcNow >= tayinDonemiDto.BaslangicTarihi && DateTime.UtcNow <= tayinDonemiDto.BitisTarihi
            };

            _context.TayinDonemleri.Add(tayinDonemi);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTayinDonemleri), new { id = tayinDonemi.Id }, tayinDonemi);
        }

        [Authorize(Roles = "Yetkili")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTayinDonemi(int id, TayinDonemi tayinDonemi)
        {
            if (id != tayinDonemi.Id)
            {
                return BadRequest();
            }

            _context.Entry(tayinDonemi).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize(Roles = "Yetkili")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTayinDonemi(int id)
        {
            var tayinDonemi = await _context.TayinDonemleri.FindAsync(id);
            if (tayinDonemi == null)
            {
                return NotFound();
            }

            _context.TayinDonemleri.Remove(tayinDonemi);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
} 