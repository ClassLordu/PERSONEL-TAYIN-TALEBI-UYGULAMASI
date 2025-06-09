using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace personel_tayin_talebi_api.Models
{
    public class Talep
    {
        public int Id { get; set; }

        // Kimin talep yaptığı
        public int PersonelId { get; set; }
        public virtual Personel Personel { get; set; } = null!;

        // Talebin detayları
        public int MevcutAdliyeId { get; set; }
        public virtual Adliye MevcutAdliye { get; set; } = null!;

        public string Gerekce { get; set; } = string.Empty;
        public DateTime TalepTarihi { get; set; }

        // Yabancı Anahtarlar (Lookup Tabloları)
        public int TalepTuruId { get; set; }
        public virtual TalepTuru TalepTuru { get; set; } = null!;

        public int TalepDurumuId { get; set; }
        public virtual TalepDurumu TalepDurumu { get; set; } = null!;

        // Yetkili Kararı Sonrası
        public DateTime? KararTarihi { get; set; }
        public string? KararAciklamasi { get; set; }
        
        [ForeignKey("AtananAdliye")]
        public int? AtananAdliyeId { get; set; } // Onaylanırsa atandığı yer
        public virtual Adliye? AtananAdliye { get; set; }

        public virtual ICollection<TalepTercihi> TalepTercihleri { get; set; }
    }
} 