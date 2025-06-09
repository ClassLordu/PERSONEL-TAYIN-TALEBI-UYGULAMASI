using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using personel_tayin_talebi_api.Data;
using personel_tayin_talebi_api.Models;
using personel_tayin_talebi_api.Services;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace personel_tayin_talebi_api.Controllers
{
    public static class StatikDegerler
    {
        public const string TalepDurumu_Beklemede = "Beklemede";
        public const string TalepDurumu_Onaylandi = "Onaylandı";
        public const string TalepDurumu_Reddedildi = "Reddedildi";

        public const string TalepTuru_IstegeBagli = "İsteğe Bağlı";
        public const string TalepTuru_ZorunluHizmet = "Zorunlu Hizmet";
    }

    public class TalepCreateDto
    {
        public List<int> TalepEdilenAdliyeIds { get; set; } = new List<int>();
        public string Gerekce { get; set; } = string.Empty;
        public int TalepTuruId { get; set; }
    }

    public class TalepOnayDto
    {
        public int AtananAdliyeId { get; set; }
        public string KararAciklamasi { get; set; } = string.Empty;
    }

    public class TalepRedDto
    {
        public string KararAciklamasi { get; set; } = string.Empty;
    }

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TaleplerController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IIslemKaydiService _islemKaydiService;

        public TaleplerController(ApplicationDbContext context, IIslemKaydiService islemKaydiService)
        {
            _context = context;
            _islemKaydiService = islemKaydiService;
        }

        private IQueryable<Talep> GetBaseTalepQuery()
        {
            return _context.Talepler
                .Include(t => t.Personel)
                    .ThenInclude(p => p.CalismaGecmisleri)
                    .ThenInclude(cg => cg.Unvan)
                .Include(t => t.MevcutAdliye)
                .Include(t => t.AtananAdliye)
                .Include(t => t.TalepDurumu)
                .Include(t => t.TalepTercihleri)
                    .ThenInclude(tt => tt.Adliye);
        }

        private object MapTalepToDto(Talep t)
        {
            var mevcutGorev = t.Personel.CalismaGecmisleri.OrderByDescending(cg => cg.BaslamaTarihi).FirstOrDefault();
            return new
            {
                t.Id,
                t.PersonelId,
                PersonelAdi = $"{t.Personel.Ad} {t.Personel.Soyad}",
                PersonelSicil = t.Personel.SicilNumarasi,
                Unvan = mevcutGorev?.Unvan?.Ad,
                MevcutAdliyeId = t.MevcutAdliyeId,
                MevcutAdliye = t.MevcutAdliye.Ad,
                TalepTarihi = t.TalepTarihi.ToLocalTime(),
                Gerekce = t.Gerekce,
                Durum = t.TalepDurumu.Ad,
                KararTarihi = t.KararTarihi,
                KararAciklamasi = t.KararAciklamasi,
                AtananAdliyeId = t.AtananAdliyeId,
                AtananAdliye = t.AtananAdliye?.Ad,
                TalepEdilenAdliyeler = t.TalepTercihleri
                    .OrderBy(tt => tt.SiraNumarasi)
                    .Select(tt => new { Sira = tt.SiraNumarasi, Ad = tt.Adliye.Ad })
                    .ToList(),
            };
        }

        // GET: api/Talepler (For Admins)
        [HttpGet]
        [Authorize(Roles = "Yetkili")]
        public async Task<IActionResult> GetAllTalepler([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10, [FromQuery] string status = null)
        {
            var query = GetBaseTalepQuery();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(t => t.TalepDurumu.Ad == status);
            }

            var totalRecords = await query.CountAsync();
            var talepler = await query
                .OrderByDescending(t => t.TalepTarihi)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var mappedData = talepler.Select(MapTalepToDto).ToList();

            return Ok(new
            {
                TotalPages = (int)System.Math.Ceiling(totalRecords / (double)pageSize),
                CurrentPage = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                Data = mappedData
            });
        }

        // GET: api/Talepler/user
        [HttpGet("user")]
        public async Task<IActionResult> GetTaleplerForCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Kullanıcı kimliği bulunamadı.");
            }

            var talepler = await GetBaseTalepQuery()
                .Where(t => t.PersonelId == userId)
                .OrderByDescending(t => t.TalepTarihi)
                .ToListAsync();

            var mappedData = talepler.Select(MapTalepToDto).ToList();
            return Ok(mappedData);
        }

        // GET: api/Talepler/5 (Yetkili)
        [HttpGet("{id}")]
        [Authorize(Roles = "Yetkili")]
        public async Task<IActionResult> GetTalepById(int id)
        {
            var talep = await _context.Talepler
                .Where(t => t.Id == id)
                .Include(t => t.Personel)
                    .ThenInclude(p => p.CalismaGecmisleri)
                    .ThenInclude(cg => cg.Unvan)
                .Include(t => t.MevcutAdliye)
                .Include(t => t.TalepTercihleri)
                    .ThenInclude(tt => tt.Adliye)
                .Include(t => t.AtananAdliye)
                .Include(t => t.TalepTuru)
                .Include(t => t.TalepDurumu)
                .FirstOrDefaultAsync();

            if (talep == null)
            {
                return NotFound();
            }

            var mevcutGorev = talep.Personel.CalismaGecmisleri.OrderByDescending(cg => cg.BaslamaTarihi).FirstOrDefault();

            var result = new
            {
                talep.Id,
                talep.PersonelId,
                PersonelAdi = talep.Personel.Ad + " " + talep.Personel.Soyad,
                PersonelSicil = talep.Personel.SicilNumarasi,
                Unvan = mevcutGorev?.Unvan?.Ad,
                talep.MevcutAdliyeId,
                MevcutAdliye = talep.MevcutAdliye.Ad,
                TalepEdilenAdliyeler = talep.TalepTercihleri.OrderBy(tt => tt.SiraNumarasi).Select(tt => new { SiraNumarasi = tt.SiraNumarasi, AdliyeId = tt.AdliyeId, Ad = tt.Adliye.Ad }).ToList(),
                talep.AtananAdliyeId,
                AtananAdliye = talep.AtananAdliye != null ? talep.AtananAdliye.Ad : null,
                talep.TalepTuruId,
                TalepTuru = talep.TalepTuru.Ad,
                talep.TalepTarihi,
                talep.TalepDurumuId,
                Durum = talep.TalepDurumu.Ad,
                talep.KararTarihi,
                talep.KararAciklamasi,
                talep.Gerekce
            };

            return Ok(result);
        }

        // POST: api/Talepler
        [HttpPost]
        [Authorize(Roles = "Personel,Yetkili")]
        public async Task<IActionResult> CreateTalep([FromBody] TalepCreateDto talepDto)
        {
            if (talepDto.TalepEdilenAdliyeIds.Count > 5)
            {
                return BadRequest("En fazla 5 adliye tercihi yapabilirsiniz.");
            }

            if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var personelId))
            {
                return Unauthorized("Kullanıcı kimliği anlaşılamadı.");
            }

            var beklemedeDurumu = await _context.TalepDurumlari.FirstOrDefaultAsync(d => d.Ad == "Beklemede");
            if (beklemedeDurumu == null) return StatusCode(500, "Sistemde 'Beklemede' durumu bulunamadı.");

            var existingTalep = await _context.Talepler
                .AnyAsync(t => t.PersonelId == personelId && t.TalepDurumuId == beklemedeDurumu.Id);
            if (existingTalep)
            {
                return BadRequest("Zaten beklemede olan bir tayin talebiniz var.");
            }
            
            var personel = await _context.Personeller
                .Include(p => p.CalismaGecmisleri)
                    .ThenInclude(cg => cg.Adliye)
                        .ThenInclude(a => a.Bolge)
                .FirstOrDefaultAsync(p => p.Id == personelId);
            var mevcutGorev = personel?.CalismaGecmisleri.OrderByDescending(cg => cg.BaslamaTarihi).FirstOrDefault();
            if (mevcutGorev == null)
            {
                return BadRequest("Personelin mevcut görev yeri bilgisi bulunamadı.");
            }

            var talepTuru = await _context.TalepTurleri.FindAsync(talepDto.TalepTuruId);
            if (talepTuru == null) return BadRequest("Geçersiz talep türü.");

            if (talepTuru.Ad == StatikDegerler.TalepTuru_IstegeBagli)
            {
                var aktifTayinDonemi = await _context.TayinDonemleri.FirstOrDefaultAsync(d => d.BaslangicTarihi <= DateTime.UtcNow && d.BitisTarihi >= DateTime.UtcNow);
                if (aktifTayinDonemi == null) return BadRequest("Aktif bir tayin dönemi bulunmadığından isteğe bağlı talep oluşturulamaz.");
            }

            var mevcutBolge = mevcutGorev.Adliye.Bolge;
            var hizmetSuresiYil = (DateTime.UtcNow - mevcutGorev.BaslamaTarihi).TotalDays / 365.25;

            if (talepTuru.Ad == StatikDegerler.TalepTuru_ZorunluHizmet && hizmetSuresiYil < mevcutBolge.ZorunluHizmetSuresiYil)
            {
                return BadRequest($"Bu bölgedeki zorunlu hizmet sürenizi ({mevcutBolge.ZorunluHizmetSuresiYil} yıl) henüz tamamlamadınız. Mevcut hizmet süreniz: {hizmetSuresiYil:F1} yıl.");
            }
            
            if (talepDto.TalepEdilenAdliyeIds == null || !talepDto.TalepEdilenAdliyeIds.Any())
            {
                return BadRequest("En az bir adliye seçmelisiniz.");
            }

            var talep = new Talep
            {
                PersonelId = personelId,
                MevcutAdliyeId = mevcutGorev.AdliyeId,
                Gerekce = talepDto.Gerekce,
                TalepTuruId = talepDto.TalepTuruId,
                TalepDurumuId = beklemedeDurumu.Id,
                TalepTarihi = DateTime.UtcNow,
                TalepTercihleri = new List<TalepTercihi>()
            };

            int sira = 1;
            foreach (var adliyeId in talepDto.TalepEdilenAdliyeIds)
            {
                var adliye = await _context.Adliyeler.FindAsync(adliyeId);
                if (adliye == null)
                {
                    return BadRequest($"Geçersiz Adliye ID: {adliyeId}");
                }
                talep.TalepTercihleri.Add(new TalepTercihi { AdliyeId = adliyeId, SiraNumarasi = sira++ });
            }

            _context.Talepler.Add(talep);
            await _context.SaveChangesAsync();
            await _islemKaydiService.LogAsync("Talep Oluşturma", $"Personel (ID: {personelId}) yeni tayin talebi oluşturdu. Talep ID: {talep.Id}", personelId, HttpContext.Connection.RemoteIpAddress?.ToString());

            return CreatedAtAction(nameof(GetTaleplerForCurrentUser), new { id = talep.Id }, talep);
        }

        // POST: api/Talepler/{id}/onayla
        [HttpPost("{id}/onayla")]
        [Authorize(Roles = "Yetkili")]
        public async Task<IActionResult> OnaylaTalep(int id, [FromBody] TalepOnayDto onayDto)
        {
            var talep = await _context.Talepler
                .Include(t => t.Personel)
                .ThenInclude(p => p.CalismaGecmisleri)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (talep == null) return NotFound();

            var onaylandiDurumu = await _context.TalepDurumlari.FirstOrDefaultAsync(d => d.Ad == "Onaylandı");
            if (onaylandiDurumu == null) return StatusCode(500, "Sistemde 'Onaylandı' durumu bulunamadı.");

            talep.TalepDurumuId = onaylandiDurumu.Id;
            talep.KararTarihi = DateTime.UtcNow;
            talep.KararAciklamasi = onayDto.KararAciklamasi;
            talep.AtananAdliyeId = onayDto.AtananAdliyeId;

            // KRİTİK DÜZELTME: Personelin çalışma geçmişini güncelle
            var mevcutGorev = talep.Personel.CalismaGecmisleri
                                    .OrderByDescending(cg => cg.BaslamaTarihi)
                                    .FirstOrDefault(cg => cg.AyrilmaTarihi == null);

            if (mevcutGorev == null)
            {
                return BadRequest("Talebi onaylanacak personelin aktif bir görevi bulunamadı. Veri bütünlüğü sorunu olabilir.");
            }

            mevcutGorev.AyrilmaTarihi = DateTime.UtcNow;
            _context.CalismaGecmisleri.Update(mevcutGorev);

            var yeniGorev = new CalismaGecmisi
            {
                PersonelId = talep.PersonelId,
                AdliyeId = onayDto.AtananAdliyeId,
                UnvanId = mevcutGorev.UnvanId,
                BaslamaTarihi = DateTime.UtcNow,
                AyrilmaTarihi = null
            };
            _context.CalismaGecmisleri.Add(yeniGorev);


            _context.Talepler.Update(talep);
            await _context.SaveChangesAsync();
            await _islemKaydiService.LogAsync("Talep Onaylama", $"Talep (ID: {id}) onaylandı. Atandığı yer: {onayDto.AtananAdliyeId}", GetYetkiliId(), HttpContext.Connection.RemoteIpAddress?.ToString());

            return NoContent();
        }

        // POST: api/Talepler/{id}/reddet
        [HttpPost("{id}/reddet")]
        [Authorize(Roles = "Yetkili")]
        public async Task<IActionResult> ReddetTalep(int id, [FromBody] TalepRedDto redDto)
        {
            var talep = await _context.Talepler.FindAsync(id);
            if (talep == null) return NotFound();

            var reddedildiDurumu = await _context.TalepDurumlari.FirstOrDefaultAsync(d => d.Ad == "Reddedildi");
            if (reddedildiDurumu == null) return StatusCode(500, "Sistemde 'Reddedildi' durumu bulunamadı.");

            talep.TalepDurumuId = reddedildiDurumu.Id;
            talep.KararTarihi = DateTime.UtcNow;
            talep.KararAciklamasi = redDto.KararAciklamasi;
            talep.AtananAdliyeId = null; // Reddedildiği için atama yok.

            _context.Talepler.Update(talep);
            await _context.SaveChangesAsync();
            await _islemKaydiService.LogAsync("Talep Reddetme", $"Talep (ID: {id}) reddedildi.", GetYetkiliId(), HttpContext.Connection.RemoteIpAddress?.ToString());

            return NoContent();
        }

        private int? GetYetkiliId()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(userIdClaim, out var userId) ? userId : null;
        }
    }
} 