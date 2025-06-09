using System;

namespace personel_tayin_talebi_api.Models
{
    public class TayinDonemi
    {
        public int Id { get; set; }
        public string Ad { get; set; } = string.Empty;
        public DateTime BaslangicTarihi { get; set; }
        public DateTime BitisTarihi { get; set; }
        public bool AktifMi { get; set; }
    }
} 