using personel_tayin_talebi_api.Data;
using personel_tayin_talebi_api.Models;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace personel_tayin_talebi_api.Services
{
    public class IslemKaydiService : IIslemKaydiService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public IslemKaydiService(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task LogAsync(string eylem, string aciklama, int? personelId, string? ipAdresi)
        {
            var log = new IslemKaydi
            {
                Eylem = eylem,
                Aciklama = aciklama,
                PersonelId = personelId,
                Tarih = DateTime.UtcNow,
                IpAdresi = ipAdresi ?? _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString()
            };

            await _context.IslemKayitlari.AddAsync(log);
            await _context.SaveChangesAsync();
        }
    }
} 