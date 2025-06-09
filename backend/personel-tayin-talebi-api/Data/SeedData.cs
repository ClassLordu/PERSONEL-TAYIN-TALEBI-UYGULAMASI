using Microsoft.EntityFrameworkCore;
using personel_tayin_talebi_api.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace personel_tayin_talebi_api.Data
{
    public static class SeedData
    {
        public static void Initialize(ApplicationDbContext context)
        {
            // Veri tohumlama işlemleri, ilgili tablo boşsa yapılır.
            // Bu, metodun birden çok kez güvenle çağrılabilmesini sağlar.

            if (!context.Roller.Any())
            {
                var roller = new List<Rol>
                {
                    new Rol { Ad = "Personel" },
                    new Rol { Ad = "Yetkili" }
                };
                context.Roller.AddRange(roller);
            }

            if (!context.Bolgeler.Any())
            {
                var bolgeler = new List<Bolge>
                {
                    new Bolge { Ad = "1. Bölge", ZorunluHizmetSuresiYil = 5 },
                    new Bolge { Ad = "2. Bölge", ZorunluHizmetSuresiYil = 4 },
                    new Bolge { Ad = "3. Bölge", ZorunluHizmetSuresiYil = 3 },
                    new Bolge { Ad = "4. Bölge", ZorunluHizmetSuresiYil = 2 },
                    new Bolge { Ad = "5. Bölge", ZorunluHizmetSuresiYil = 2 }
                };
                context.Bolgeler.AddRange(bolgeler);
            }

            if (!context.TalepTurleri.Any())
            {
                var talepTurleri = new List<TalepTuru>
                {
                    new TalepTuru { Ad = "İsteğe Bağlı" },
                    new TalepTuru { Ad = "Zorunlu Hizmet" },
                    new TalepTuru { Ad = "Eş Durumu" },
                    new TalepTuru { Ad = "Sağlık Mazereti" }
                };
                context.TalepTurleri.AddRange(talepTurleri);
            }

            if (!context.TalepDurumlari.Any())
            {
                var talepDurumlari = new List<TalepDurumu>
                {
                    new TalepDurumu { Ad = "Beklemede" }, // "Onay Bekliyor" -> "Beklemede" olarak düzeltildi.
                    new TalepDurumu { Ad = "Onaylandı" },
                    new TalepDurumu { Ad = "Reddedildi" },
                    new TalepDurumu { Ad = "İptal Edildi" }
                };
                context.TalepDurumlari.AddRange(talepDurumlari);
            }

            if (!context.Unvanlar.Any())
            {
                var unvanlar = new List<Unvan>
                {
                    new Unvan { Ad = "Zabıt Katibi" },
                    new Unvan { Ad = "Mübaşir" },
                    new Unvan { Ad = "İnfaz ve Koruma Memuru" },
                    new Unvan { Ad = "Mühendis" },
                    new Unvan { Ad = "Teknisyen" }
                };
                context.Unvanlar.AddRange(unvanlar);
            }

            context.SaveChanges(); // Önce bağımsız tabloları kaydet

            // --- Diğer Seed işlemleri (Personel, Adliye vb.) ---
            // Bu kısım, yalnızca tüm veritabanı boşken çalıştırılmak istenebilir.
            // Bu yüzden ayrı bir kontrol bloğuna alıyoruz.
            if (!context.Personeller.Any() && !context.Adliyeler.Any())
            {
                var bolgeler = context.Bolgeler.ToList();
                var roller = context.Roller.ToList();
                var unvanlar = context.Unvanlar.ToList();
                var talepTurleri = context.TalepTurleri.ToList();
                var talepDurumlari = context.TalepDurumlari.ToList();

                var iller = new List<string>
                {
                    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
                    "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
                    "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
                    "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
                    "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
                    "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
                    "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
                    "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
                };

                var bolgeAtamalari = new Dictionary<string, int>
                {
                    // Bölge 1: Marmara / Ege
                    {"İstanbul", 0}, {"Bursa", 0}, {"İzmir", 0}, {"Kocaeli", 0}, {"Tekirdağ", 0}, {"Edirne", 0}, {"Kırklareli", 0}, {"Çanakkale", 0}, {"Balıkesir", 0}, {"Yalova", 0}, {"Sakarya", 0}, {"Bilecik", 0}, {"Manisa", 0}, {"Aydın", 0}, {"Muğla", 0}, {"Denizli", 0},
                    // Bölge 2: İç Anadolu / Akdeniz
                    {"Ankara", 1}, {"Eskişehir", 1}, {"Konya", 1}, {"Kayseri", 1}, {"Antalya", 1}, {"Mersin", 1}, {"Adana", 1}, {"Hatay", 1}, {"Isparta", 1}, {"Burdur", 1}, {"Uşak", 1}, {"Afyonkarahisar", 1},
                    // Bölge 3: Karadeniz / İç Anadolu Diğer
                    {"Samsun", 2}, {"Trabzon", 2}, {"Zonguldak", 2}, {"Ordu", 2}, {"Rize", 2}, {"Bolu", 2}, {"Düzce", 2}, {"Karabük", 2}, {"Bartın", 2}, {"Kastamonu", 2}, {"Sinop", 2}, {"Çorum", 2}, {"Amasya", 2}, {"Tokat", 2}, {"Giresun", 2}, {"Sivas", 2}, {"Yozgat", 2}, {"Kırşehir", 2}, {"Nevşehir", 2}, {"Niğde", 2}, {"Aksaray", 2}, {"Kırıkkale", 2}, {"Çankırı", 2}, {"Karaman", 2},
                    // Bölge 4: Doğu Anadolu
                    {"Erzurum", 3}, {"Malatya", 3}, {"Elazığ", 3}, {"Erzincan", 3}, {"Van", 3}, {"Kars", 3}, {"Ağrı", 3}, {"Muş", 3}, {"Bingöl", 3}, {"Bitlis", 3}, {"Tunceli", 3}, {"Gümüşhane", 3}, {"Bayburt", 3}, {"Ardahan", 3}, {"Iğdır", 3},
                    // Bölge 5: Güneydoğu Anadolu
                    {"Gaziantep", 4}, {"Şanlıurfa", 4}, {"Diyarbakır", 4}, {"Mardin", 4}, {"Batman", 4}, {"Siirt", 4}, {"Şırnak", 4}, {"Hakkari", 4}, {"Adıyaman", 4}, {"Kilis", 4}, {"Kahramanmaraş", 4}, {"Osmaniye", 4}
                };

                var adliyeler = new List<Adliye>();
                foreach (var il in iller.OrderBy(i => i))
                {
                    // Varsayılan ilçe merkez olacak
                    var ilce = "Merkez";
                    if(il == "Ankara") ilce = "Çankaya";
                    if(il == "İstanbul") ilce = "Fatih";
                    if(il == "İzmir") ilce = "Konak";
                    if(il == "Antalya") ilce = "Muratpaşa";
                    if(il == "Bursa") ilce = "Osmangazi";
                    if(il == "Konya") ilce = "Selçuklu";
                    if(il == "Diyarbakır") ilce = "Bağlar";

                    var bolgeIndex = bolgeAtamalari.ContainsKey(il) ? bolgeAtamalari[il] : 2; // Bulunamazsa varsayılan 3. bölge

                    adliyeler.Add(new Adliye { Ad = $"{il} Adliyesi", Il = il, Ilce = ilce, Bolge = bolgeler[bolgeIndex] });
                }
                context.Adliyeler.AddRange(adliyeler);

                var personeller = new List<Personel>
                {
                    new Personel
                    {
                        Ad = "Ali", Soyad = "Veli", SicilNumarasi = "12345",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123"),
                        HizmetPuani = 85,
                        Roller = new List<Rol> { roller.Single(r => r.Ad == "Personel") }
                    },
                    new Personel
                    {
                        Ad = "Onur Can", Soyad = "ALEMDAROĞLU", SicilNumarasi = "255867",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123"),
                        HizmetPuani = 95,
                        Roller = new List<Rol> { roller.Single(r => r.Ad == "Yetkili") }
                    }
                };
                context.Personeller.AddRange(personeller);

                var calismaGecmisleri = new List<CalismaGecmisi>
                {
                    new CalismaGecmisi { Personel = personeller[0], Adliye = adliyeler.Single(a => a.Il == "Ankara"), Unvan = unvanlar.Single(u => u.Ad == "Zabıt Katibi"), BaslamaTarihi = DateTime.UtcNow.AddYears(-4) },
                    new CalismaGecmisi { Personel = personeller[1], Adliye = adliyeler.Single(a => a.Il == "Şırnak"), Unvan = unvanlar.Single(u => u.Ad == "Mühendis"), BaslamaTarihi = DateTime.UtcNow.AddYears(-2) }
                };
                context.CalismaGecmisleri.AddRange(calismaGecmisleri);

                var talepler = new List<Talep>
                {
                    new Talep
                    {
                        Personel = personeller[0], // Ali Veli
                        MevcutAdliye = adliyeler.Single(a => a.Il == "Ankara"),
                        Gerekce = "Ailevi nedenler ve hizmet süresi dolumu.",
                        TalepTarihi = DateTime.UtcNow.AddDays(-5),
                        TalepTuru = talepTurleri.Single(tt => tt.Ad == "İsteğe Bağlı"),
                        TalepDurumu = talepDurumlari.Single(td => td.Ad == "Beklemede"),
                        TalepTercihleri = new List<TalepTercihi>
                        {
                            new TalepTercihi { Adliye = adliyeler.Single(a => a.Il == "İzmir"), SiraNumarasi = 1 },
                            new TalepTercihi { Adliye = adliyeler.Single(a => a.Il == "Antalya"), SiraNumarasi = 2 }
                        }
                    }
                };
                context.Talepler.AddRange(talepler);
            }

            // Tüm değişiklikleri tek seferde veritabanına kaydet.
            try
            {
                context.SaveChanges();
            }
            catch (Exception ex)
            {
                // Hata durumunda konsola detaylı bilgi yazdır.
                Console.WriteLine("SeedData sırasında bir hata oluştu: " + ex.ToString());
                throw;
            }
        }
    }
} 