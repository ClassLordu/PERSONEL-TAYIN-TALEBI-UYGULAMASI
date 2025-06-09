using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;

namespace personel_tayin_talebi_api.Models
{
    public class Personel
    {
        public Personel()
        {
            Roller = new HashSet<Rol>();
            CalismaGecmisleri = new HashSet<CalismaGecmisi>();
            Talepler = new HashSet<Talep>();
        }

        public int Id { get; set; }

        [Required]
        public string Ad { get; set; } = string.Empty;
        
        [Required]
        public string Soyad { get; set; } = string.Empty;
        
        [Required]
        public string SicilNumarasi { get; set; } = string.Empty;

        [Required]
        [JsonIgnore]
        public string PasswordHash { get; set; } = string.Empty;

        public double HizmetPuani { get; set; }
        
        public virtual ICollection<Rol> Roller { get; set; } = new List<Rol>();

        public virtual ICollection<CalismaGecmisi> CalismaGecmisleri { get; set; } = new List<CalismaGecmisi>();
        
        public virtual ICollection<Talep> Talepler { get; set; } = new List<Talep>();
    }
} 