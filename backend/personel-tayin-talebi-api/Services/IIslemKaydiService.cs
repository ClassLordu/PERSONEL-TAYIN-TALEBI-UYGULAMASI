using System.Threading.Tasks;

namespace personel_tayin_talebi_api.Services
{
    public interface IIslemKaydiService
    {
        Task LogAsync(string eylem, string aciklama, int? personelId, string? ipAdresi);
    }
} 