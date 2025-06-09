using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using personel_tayin_talebi_api.Data;
using personel_tayin_talebi_api.Models;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BCrypt.Net;

namespace personel_tayin_talebi_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PersonelController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PersonelController(ApplicationDbContext context)
        {
            _context = context;
        }

        // DTO for creating and updating personnel
        public class PersonelDto
        {
            public string SicilNumarasi { get; set; }
            public string Ad { get; set; }
            public string Soyad { get; set; }
            public int? UnvanId { get; set; }
            public int? MevcutAdliyeId { get; set; }
            public DateTime? BaslamaTarihi { get; set; }
            public string? Password { get; set; } // Nullable for updates
        }

        // GET: api/Personel
        [HttpGet]
        [Authorize(Roles = "Yetkili")]
        public async Task<IActionResult> GetAllPersonel()
        {
            var personeller = await _context.Personeller
                .Include(p => p.CalismaGecmisleri)
                .ThenInclude(cg => cg.Unvan)
                .Include(p => p.CalismaGecmisleri)
                .ThenInclude(cg => cg.Adliye)
                .ToListAsync();

            var result = personeller.Select(p =>
            {
                var mevcutGorev = p.CalismaGecmisleri?.OrderByDescending(cg => cg.BaslamaTarihi).FirstOrDefault();
                return new
                {
                    p.Id,
                    p.SicilNumarasi,
                    p.Ad,
                    p.Soyad,
                    Unvan = mevcutGorev?.Unvan?.Ad,
                    MevcutAdliye = mevcutGorev?.Adliye?.Ad,
                    MevcutAdliyeId = mevcutGorev?.AdliyeId,
                    UnvanId = mevcutGorev?.UnvanId,
                    IseBaslamaTarihi = mevcutGorev?.BaslamaTarihi
                };
            })
            .OrderByDescending(p => p.IseBaslamaTarihi) // Sort by start date, newest first
            .ToList();

            return Ok(result);
        }

        // HERKES (KENDİSİ): Giriş yapmış kullanıcı kendi bilgilerini görür.
        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized("Kullanıcı kimliği bulunamadı.");
            }

            var personel = await _context.Personeller
                .Where(p => p.Id == userId)
                .Include(p => p.Roller)
                .Include(p => p.CalismaGecmisleri)
                    .ThenInclude(cg => cg.Unvan)
                .Include(p => p.CalismaGecmisleri)
                    .ThenInclude(cg => cg.Adliye)
                .FirstOrDefaultAsync();

            if (personel == null)
            {
                return NotFound("Personel bulunamadı.");
            }
            
            var mevcutGorev = personel.CalismaGecmisleri?.OrderByDescending(cg => cg.BaslamaTarihi).FirstOrDefault();

            var result = new
            {
                personel.Id,
                personel.SicilNumarasi,
                personel.Ad,
                personel.Soyad,
                Roller = personel.Roller.Select(r => r.Ad).ToList(),
                Unvan = mevcutGorev?.Unvan?.Ad,
                MevcutAdliye = mevcutGorev?.Adliye?.Ad,
                HizmetPuani = personel.HizmetPuani,
                CalismaGecmisi = personel.CalismaGecmisleri?.Select(cg => new {
                    UnvanAdi = cg.Unvan?.Ad,
                    AdliyeAdi = cg.Adliye?.Ad,
                    cg.BaslamaTarihi,
                    cg.AyrilmaTarihi
                }).OrderByDescending(x => x.BaslamaTarihi).ToList()
            };

            return Ok(result);
        }

        // YETKİLİ: ID ile belirli bir personelin detayını görür.
        [HttpGet("{id}")]
        [Authorize(Roles = "Yetkili")]
        public async Task<IActionResult> GetPersonelById(int id)
        {
            var personel = await GetPersonelDetayById(id);
            if (personel == null)
            {
                return NotFound();
            }
            return Ok(personel);
        }

        // Ortak private metot
        private async Task<object?> GetPersonelDetayById(int id)
        {
            var personel = await _context.Personeller
               .Where(p => p.Id == id)
               .Include(p => p.Roller)
               .Include(p => p.CalismaGecmisleri).ThenInclude(cg => cg.Adliye)
               .Include(p => p.CalismaGecmisleri).ThenInclude(cg => cg.Unvan)
               .FirstOrDefaultAsync();

            if (personel == null)
            {
                return null;
            }

            var mevcutGorev = personel.CalismaGecmisleri
                .OrderByDescending(c => c.BaslamaTarihi)
                .FirstOrDefault(c => c.AyrilmaTarihi == null);

            return new
            {
                personel.Id,
                personel.Ad,
                personel.Soyad,
                personel.SicilNumarasi,
                Unvan = mevcutGorev?.Unvan?.Ad,
                MevcutAdliye = mevcutGorev?.Adliye?.Ad,
                personel.HizmetPuani,
                Roller = personel.Roller.Select(r => r.Ad).ToList(),
                CalismaGecmisi = personel.CalismaGecmisleri.OrderByDescending(c => c.BaslamaTarihi).Select(cg => new
                {
                    AdliyeAdi = cg.Adliye.Ad,
                    UnvanAdi = cg.Unvan.Ad,
                    cg.BaslamaTarihi,
                    cg.AyrilmaTarihi
                }).ToList()
            };
        }

        // POST: api/Personel
        [HttpPost]
        public async Task<IActionResult> CreatePersonel([FromBody] PersonelDto personelDto)
        {
            if (!ModelState.IsValid || string.IsNullOrEmpty(personelDto.Password) || !personelDto.BaslamaTarihi.HasValue)
            {
                return BadRequest("Tüm alanlar (Şifre ve İşe Başlama Tarihi dahil) doldurulmalıdır.");
            }

            if (await _context.Personeller.AnyAsync(p => p.SicilNumarasi == personelDto.SicilNumarasi))
            {
                return BadRequest("Bu sicil numarası zaten kayıtlı.");
            }
            
            // Find the "Personel" role
            var personelRole = await _context.Roller.FirstOrDefaultAsync(r => r.Ad == "Personel");
            if (personelRole == null)
            {
                return StatusCode(500, "Sistemde 'Personel' rolü bulunamadı. Lütfen sistem yöneticisi ile görüşün.");
            }

            var yeniPersonel = new Personel
            {
                SicilNumarasi = personelDto.SicilNumarasi,
                Ad = personelDto.Ad,
                Soyad = personelDto.Soyad,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(personelDto.Password)
            };
            
            // Assign the role
            yeniPersonel.Roller.Add(personelRole);

            _context.Personeller.Add(yeniPersonel);
            await _context.SaveChangesAsync(); 

            if (personelDto.UnvanId.HasValue && personelDto.MevcutAdliyeId.HasValue)
            {
                var calismaGecmisi = new CalismaGecmisi
                {
                    PersonelId = yeniPersonel.Id,
                    AdliyeId = personelDto.MevcutAdliyeId.Value,
                    UnvanId = personelDto.UnvanId.Value,
                    BaslamaTarihi = personelDto.BaslamaTarihi.Value,
                    AyrilmaTarihi = null
                };
                _context.CalismaGecmisleri.Add(calismaGecmisi);
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllPersonel), new { id = yeniPersonel.Id }, yeniPersonel);
        }

        // PUT: api/Personel/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePersonel(int id, [FromBody] PersonelDto personelDto)
        {
            var personel = await _context.Personeller.Include(p => p.CalismaGecmisleri).FirstOrDefaultAsync(p => p.Id == id);
            if (personel == null) return NotFound();

            personel.SicilNumarasi = personelDto.SicilNumarasi;
            personel.Ad = personelDto.Ad;
            personel.Soyad = personelDto.Soyad;
            
            if (!string.IsNullOrEmpty(personelDto.Password))
            {
                personel.PasswordHash = BCrypt.Net.BCrypt.HashPassword(personelDto.Password);
            }
            
            var mevcutGorev = personel.CalismaGecmisleri.OrderByDescending(cg => cg.BaslamaTarihi).FirstOrDefault();
            
            if(mevcutGorev != null)
            {
                // Update only if values are provided in DTO
                if (personelDto.UnvanId.HasValue) mevcutGorev.UnvanId = personelDto.UnvanId.Value;
                if (personelDto.MevcutAdliyeId.HasValue) mevcutGorev.AdliyeId = personelDto.MevcutAdliyeId.Value;
                if (personelDto.BaslamaTarihi.HasValue) mevcutGorev.BaslamaTarihi = personelDto.BaslamaTarihi.Value;
            }
            else if (personelDto.UnvanId.HasValue && personelDto.MevcutAdliyeId.HasValue && personelDto.BaslamaTarihi.HasValue)
            {
                // If no work history exists, create one
                var yeniGorev = new CalismaGecmisi
                {
                    PersonelId = id,
                    AdliyeId = personelDto.MevcutAdliyeId.Value,
                    UnvanId = personelDto.UnvanId.Value,
                    BaslamaTarihi = personelDto.BaslamaTarihi.Value
                };
                _context.CalismaGecmisleri.Add(yeniGorev);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Personel/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePersonel(int id)
        {
            var personel = await _context.Personeller.FindAsync(id);
            if (personel == null) return NotFound();

            var talepler = await _context.Talepler.Where(t => t.PersonelId == id).ToListAsync();
            if (talepler.Any()) _context.Talepler.RemoveRange(talepler);

            var calismaGecmisleri = await _context.CalismaGecmisleri.Where(cg => cg.PersonelId == id).ToListAsync();
            if (calismaGecmisleri.Any()) _context.CalismaGecmisleri.RemoveRange(calismaGecmisleri);

            // Add this block to delete related IslemKayitlari
            var islemKayitlari = await _context.IslemKayitlari.Where(ik => ik.PersonelId == id).ToListAsync();
            if (islemKayitlari.Any()) _context.IslemKayitlari.RemoveRange(islemKayitlari);

            _context.Personeller.Remove(personel);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 