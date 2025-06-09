using System.Collections.Generic;

namespace personel_tayin_talebi_api.Models
{
    public class Adliye
    {
        public int Id { get; set; }
        public string Ad { get; set; } = string.Empty;
        public string Il { get; set; } = string.Empty;
        public string Ilce { get; set; } = string.Empty;

        public int BolgeId { get; set; }
        public virtual Bolge Bolge { get; set; } = null!;
    }
} 