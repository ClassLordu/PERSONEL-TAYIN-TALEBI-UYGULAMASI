namespace personel_tayin_talebi_api.Models
{
    public class TalepTercihi
    {
        public int Id { get; set; }
        public int SiraNumarasi { get; set; } // 1, 2, 3...

        public int TalepId { get; set; }
        public Talep Talep { get; set; }

        public int AdliyeId { get; set; }
        public Adliye Adliye { get; set; }
    }
} 