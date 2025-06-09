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
    [Authorize(Roles = "Yetkili")]
    public class IslemKayitlariController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public IslemKayitlariController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/IslemKayitlari
        [HttpGet]
        public async Task<IActionResult> GetIslemKayitlari([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 15, [FromQuery] string searchTerm = null, [FromQuery] string eylemTipi = null)
        {
            var query = _context.IslemKayitlari
                .Include(ik => ik.Personel)
                .OrderByDescending(ik => ik.Tarih)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var lowerCaseSearchTerm = searchTerm.ToLower();
                query = query.Where(ik =>
                    (ik.Personel.Ad + " " + ik.Personel.Soyad).ToLower().Contains(lowerCaseSearchTerm) ||
                    ik.Eylem.ToLower().Contains(lowerCaseSearchTerm) ||
                    ik.Aciklama.ToLower().Contains(lowerCaseSearchTerm) ||
                    ik.IpAdresi.ToLower().Contains(lowerCaseSearchTerm)
                );
            }

            if (!string.IsNullOrWhiteSpace(eylemTipi))
            {
                query = query.Where(ik => ik.Eylem == eylemTipi);
            }

            var totalRecords = await query.CountAsync();
            var islemKayitlari = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(ik => new
                {
                    ik.Id,
                    PersonelAdi = ik.Personel != null ? $"{ik.Personel.Ad} {ik.Personel.Soyad}" : "Sistem",
                    IslemTipi = ik.Eylem,
                    ik.Aciklama,
                    ik.Tarih,
                    ik.IpAdresi
                })
                .ToListAsync();
            
            return Ok(new
            {
                TotalPages = (int)System.Math.Ceiling(totalRecords / (double)pageSize),
                CurrentPage = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                Data = islemKayitlari
            });
        }

        // GET: api/IslemKayitlari/eylem-tipleri
        [HttpGet("eylem-tipleri")]
        public async Task<IActionResult> GetEylemTipleri()
        {
            var eylemTipleri = await _context.IslemKayitlari
                .Select(ik => ik.Eylem)
                .Distinct()
                .OrderBy(e => e)
                .ToListAsync();
            
            return Ok(eylemTipleri);
        }
    }
}
