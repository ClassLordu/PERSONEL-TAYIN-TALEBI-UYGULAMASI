using System;

namespace personel_tayin_talebi_api.Models
{
    public class CalismaGecmisi
    {
        public int Id { get; set; }

        public int PersonelId { get; set; }
        public virtual Personel Personel { get; set; } = null!;

        public int AdliyeId { get; set; }
        public virtual Adliye Adliye { get; set; } = null!;
        
        public int UnvanId { get; set; }
        public virtual Unvan Unvan { get; set; } = null!;

        public DateTime BaslamaTarihi { get; set; }
        public DateTime? AyrilmaTarihi { get; set; }
    }
} 