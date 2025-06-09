# Personel Tayin Talebi Uygulaması

Bu uygulama, personelin tayin taleplerini yönetmek için kullanılan kapsamlı bir sistemdir. Adliyede görev yapan yazı işleri müdürü, zabıt katibi, mübaşir gibi unvanlardaki personelin başka bir adliyeye tayin talebinde bulunabileceği, Personelin sistem üzerinden tercihlerini, talep türünü ve açıklamalarını girerek başvurusunu iletebileceği, personel ve yöneticiler için ayrı arayüzler sunarak tayin süreçlerini dijitalleştirmeyi ve kolaylaştırmayı amaçlar.

## Proje Yapısı

Uygulama, bir .NET Core API backend ve React frontend olmak üzere iki ana bileşenden oluşur:

## Hızlı Başlangıç

- Kök dizinde yer alan baslat.sh ile hızlı başla

## Geliştirici Bilgisi & Üretim Tarihi

- Zabıt Kâtibi - Onur Can ALEMDAROĞLU (255867) - Araklı Adliyesi - Haziran 2025

## Örnek Personel && Yetkili Giriş Bilgileri

- Personel# Sicil: 12345 Şifre Password123
- Yetkili# Sicil: 255867 Şifre Password123

```
PERSONEL TAYİN TALEBİ UYGULAMASI/
├── backend/                 # .NET Core API
│   └── personel-tayin-talebi-api/
│       ├── Controllers/     # API endpoint'leri
│       ├── Data/            # Veritabanı bağlantısı ve yapılandırması
│       ├── Logs/            # Uygulama log dosyaları
│       ├── Middleware/      # Özel middleware bileşenleri
│       ├── Migrations/      # Entity Framework migrasyonları
│       ├── Models/          # Veri modelleri
│       ├── Properties/      # Uygulama özellikleri
│       └── Services/        # İş mantığı servisleri
└── frontend/                # React uygulaması
    └── personel-tayin-talebi-ui/
        ├── public/          # Statik dosyalar
        └── src/             # Kaynak kodları
            ├── components/  # Yeniden kullanılabilir UI bileşenleri
            ├── context/     # React context'leri
            ├── hooks/       # Özel React hook'ları
            ├── pages/       # Sayfa bileşenleri
            └── services/    # API ile iletişim servisleri
```

## Özellikler

### Personel İçin
- Tayin talebi oluşturma ve mevcut talepleri görüntüleme
- Profil bilgilerini yönetme
- Duyuruları ve tayin dönemlerini görüntüleme
- Kişisel kontrol paneli

### Yetkililer İçin
- Tayin taleplerini değerlendirme ve onaylama/reddetme
- Personel yönetimi (ekleme, düzenleme, silme)
- Tayin dönemi yönetimi
- Duyuru yönetimi
- İşlem kayıtlarını görüntüleme

## Teknik Altyapı

### Backend (.NET Core API)
- **Dil:** C#
- **Framework:** ASP.NET Core
- **Veritabanı:** Microsoft SQL Server (Entity Framework Core ORM)
- **Kimlik Doğrulama:** JWT token tabanlı kimlik doğrulama
- **Loglama:** Serilog
- **API Dokümantasyonu:** Swagger/OpenAPI

### Frontend (React)
- **Dil:** JavaScript
- **Framework:** React
- **UI Kütüphanesi:** Material UI
- **Durum Yönetimi:** React Context API
- **Routing:** React Router

## Kurulum

### Gereksinimler
- .NET Core SDK 9.0
- Node.js 20.0 veya üstü
- SQL Server (yerel veya uzak)

### Backend Kurulumu
1. `backend/personel-tayin-talebi-api` dizinine gidin
2. `appsettings.json` dosyasında veritabanı bağlantı dizesini yapılandırın
3. Aşağıdaki komutları çalıştırın:
   ```bash
   dotnet restore
   dotnet build
   dotnet run
   ```
4. API varsayılan olarak https://localhost:5000 adresinde çalışacaktır

### Frontend Kurulumu
1. `frontend/personel-tayin-talebi-ui` dizinine gidin
2. Aşağıdaki komutları çalıştırın:
   ```bash
   npm install
   npm start
   ```
3. Uygulama varsayılan olarak http://localhost:3000 adresinde çalışacaktır

## Kullanım

### Giriş
- Sistem, "personel" ve "yetkili" olmak üzere iki temel kullanıcı rolüne sahiptir
- Kullanıcılar `/giris` sayfasından kimlik bilgileriyle giriş yapabilir

### Personel Arayüzü
- **Kontrol Paneli:** Genel bilgiler ve özet istatistikler
- **Taleplerim:** Mevcut tayin taleplerini görüntüleme
- **Talep Oluştur:** Yeni tayin talebi oluşturma
- **Profilim:** Kişisel bilgileri yönetme

### Yetkili Arayüzü
- **Tayin Yönetimi:** Gelen talepleri değerlendirme
- **Personel Yönetimi:** Personel kayıtlarını yönetme
- **Tayin Dönemi Yönetimi:** Tayin dönemlerini oluşturma ve düzenleme
- **Duyuru Yönetimi:** Sistem duyurularını yönetme
- **İşlem Kayıtları:** Sistemdeki işlemlerin denetim kaydı







