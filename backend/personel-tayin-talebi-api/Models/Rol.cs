using System.Collections.Generic;

namespace personel_tayin_talebi_api.Models
{
    public class Rol
    {
        public int Id { get; set; }
        public string Ad { get; set; } = string.Empty;
        public virtual ICollection<Personel> Personeller { get; set; } = new List<Personel>();
    }
} 