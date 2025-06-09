using System;

namespace personel_tayin_talebi_api.Models
{
    public class Duyuru
    {
        public int Id { get; set; }
        public string Baslik { get; set; } = string.Empty;
        public string Icerik { get; set; } = string.Empty;
        public DateTime YayinTarihi { get; set; }
        public bool AktifMi { get; set; } = true;
    }
} 