using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace personel_tayin_talebi_api.Models
{
    public class IslemKaydi
    {
        public int Id { get; set; }
        public string Eylem { get; set; } = string.Empty;
        public string Aciklama { get; set; } = string.Empty;
        
        public int? PersonelId { get; set; }
        [ForeignKey("PersonelId")]
        public virtual Personel? Personel { get; set; }

        public string? IpAdresi { get; set; }

        public DateTime Tarih { get; set; }
    }
} 