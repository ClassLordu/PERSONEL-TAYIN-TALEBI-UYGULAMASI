@echo off
REM ===================================================================
REM  PERSONEL TAYIN TALEBI UYGULAMASI - BASLATICI
REM  Bu script projenin backend ve frontend bilesenlerini baslatir,
REM  veritabani islemlerini yapar.
REM ===================================================================

REM Ekran temizligi ve program baslangici
cls
color 0A
title PERSONEL TAYIN TALEBI UYGULAMASI

REM ===================================================================
REM  ANA MENU
REM ===================================================================
:ANA_MENU
cls
echo.
echo  PERSONEL TAYIN TALEBI UYGULAMASI
echo  ===============================
echo.
echo  [1] Backend (.NET Core API) Baslat
echo  [2] Frontend (React) Baslat
echo  [3] Tum Bilesenler (Backend + Frontend) Baslat
echo  [4] Veritabani Yonetimi
echo  [5] Log, Obj ve Bin Dizinlerini Temizle
echo  [6] Cikis
echo.
echo  Mevcut calisma dizini: %CD%
echo.

set /p secim="Seciminiz (1-6): "

if "%secim%"=="1" goto BACKEND_BASLAT
if "%secim%"=="2" goto FRONTEND_BASLAT
if "%secim%"=="3" goto TUMUNU_BASLAT
if "%secim%"=="4" goto VERITABANI_MENU
if "%secim%"=="5" goto TEMIZLIK_YAP
if "%secim%"=="6" goto CIKIS

echo Hatali secim! Lutfen 1-6 arasinda bir deger girin.
timeout /t 2 >nul
goto ANA_MENU

REM ===================================================================
REM  BACKEND ISLEMLERI
REM ===================================================================
:BACKEND_BASLAT
cls
echo.
echo  BACKEND BASLATILIYOR...
echo  ======================
echo.
echo  Backend API https://localhost:5000 adresinde calisacak.
echo.

if not exist "backend\personel-tayin-talebi-api\personel-tayin-talebi-api.csproj" (
    echo  [HATA] Backend dizini bulunamadi. Dosya yolunu kontrol edin.
    echo  Aranan: %CD%\backend\personel-tayin-talebi-api\personel-tayin-talebi-api.csproj
    pause
    goto ANA_MENU
)

cd backend\personel-tayin-talebi-api
start cmd /k "color 0B && title BACKEND SUNUCUSU - PERSONEL TAYIN TALEBI API && echo. && echo  BACKEND SUNUCUSU CALISIYOR... && echo  ========================== && echo. && dotnet run"
cd ..\..
goto CIKIS

REM ===================================================================
REM  FRONTEND ISLEMLERI
REM ===================================================================
:FRONTEND_BASLAT
cls
echo.
echo  FRONTEND BASLATILIYOR...
echo  =======================
echo.
echo  Frontend http://localhost:3000 adresinde calisacak.
echo.

if not exist "frontend\personel-tayin-talebi-ui\package.json" (
    echo  [HATA] Frontend dizini bulunamadi. Dosya yolunu kontrol edin.
    echo  Aranan: %CD%\frontend\personel-tayin-talebi-ui\package.json
    pause
    goto ANA_MENU
)

cd frontend\personel-tayin-talebi-ui

if not exist "node_modules" (
    echo  Node modulleri bulunamadi. Kuruluyor...
    echo.
    start cmd /k "color 0D && title FRONTEND MODUL KURULUMU && echo. && echo  MODULLER KURULUYOR... && echo  ================== && npm install && echo. && echo Kurulum tamamlandi, uygulama baslatiliyor... && npm start"
) else (
    start cmd /k "color 0D && title FRONTEND SUNUCUSU - PERSONEL TAYIN TALEBI UI && echo. && echo  FRONTEND SUNUCUSU CALISIYOR... && echo  =========================== && echo. && npm start"
)

cd ..\..
goto CIKIS

REM ===================================================================
REM  TUM BILESENLER
REM ===================================================================
:TUMUNU_BASLAT
cls
echo.
echo  TUM BILESENLER BASLATILIYOR...
echo  =============================
echo.
echo  Backend API: https://localhost:5000
echo  Frontend: http://localhost:3000
echo.

REM Backend kontrolü
if not exist "backend\personel-tayin-talebi-api\personel-tayin-talebi-api.csproj" (
    echo  [HATA] Backend dizini bulunamadi. Dosya yolunu kontrol edin.
    echo  Aranan: %CD%\backend\personel-tayin-talebi-api\personel-tayin-talebi-api.csproj
    pause
    goto ANA_MENU
)

REM Frontend kontrolü
if not exist "frontend\personel-tayin-talebi-ui\package.json" (
    echo  [HATA] Frontend dizini bulunamadi. Dosya yolunu kontrol edin.
    echo  Aranan: %CD%\frontend\personel-tayin-talebi-ui\package.json
    pause
    goto ANA_MENU
)

REM Önce backend'i başlat
cd backend\personel-tayin-talebi-api
start cmd /k "color 0B && title BACKEND SUNUCUSU - PERSONEL TAYIN TALEBI API && echo. && echo  BACKEND SUNUCUSU CALISIYOR... && echo  ========================== && echo. && dotnet run"
cd ..\..\frontend\personel-tayin-talebi-ui

REM Sonra frontend'i başlat
if not exist "node_modules" (
    echo  Node modulleri bulunamadi. Kuruluyor...
    echo.
    start cmd /k "color 0D && title FRONTEND MODUL KURULUMU && echo. && echo  MODULLER KURULUYOR... && echo  ================== && npm install && echo. && echo Kurulum tamamlandi, uygulama baslatiliyor... && npm start"
) else (
    start cmd /k "color 0D && title FRONTEND SUNUCUSU - PERSONEL TAYIN TALEBI UI && echo. && echo  FRONTEND SUNUCUSU CALISIYOR... && echo  =========================== && echo. && npm start"
)

cd ..\..
goto CIKIS

REM ===================================================================
REM  VERITABANI ISLEMLERI
REM ===================================================================
:VERITABANI_MENU
cls
echo.
echo  VERITABANI YONETIMI
echo  ==================
echo.
echo  [1] Yeni Migration Olustur
echo  [2] Veritabanini Guncelle
echo  [3] Migrations Dosyalarini Sifirla
echo  [4] Tam Veritabani Sifirlama
echo  [5] Ana Menuye Don
echo.

set /p db_secim="Seciminiz (1-5): "

if "%db_secim%"=="1" goto DB_MIGRATION_OLUSTUR
if "%db_secim%"=="2" goto DB_GUNCELLE
if "%db_secim%"=="3" goto DB_MIGRATIONS_SIFIRLA
if "%db_secim%"=="4" goto DB_TAM_SIFIRLAMA
if "%db_secim%"=="5" goto ANA_MENU

echo Hatali secim! Lutfen 1-5 arasinda bir deger girin.
timeout /t 2 >nul
goto VERITABANI_MENU

REM --- Migration Oluşturma İşlemi ---
:DB_MIGRATION_OLUSTUR
cls
echo.
echo  YENI MIGRATION OLUSTURMA
echo  ======================
echo.

cd backend\personel-tayin-talebi-api
set /p migration_name="Migration ismi: "
echo.
echo  '%migration_name%' isimli migration olusturuluyor...
dotnet ef migrations add %migration_name%
echo.
echo  Islem tamamlandi!
pause
cd ..\..
goto VERITABANI_MENU

REM --- Veritabanı Güncelleme İşlemi ---
:DB_GUNCELLE
cls
echo.
echo  VERITABANI GUNCELLEME
echo  ===================
echo.

cd backend\personel-tayin-talebi-api
echo  Veritabani guncelleniyor...
dotnet ef database update
echo.
echo  Islem tamamlandi!
pause
cd ..\..
goto VERITABANI_MENU

REM --- Migrations Sıfırlama İşlemi ---
:DB_MIGRATIONS_SIFIRLA
cls
echo.
echo  MIGRATIONS DOSYALARINI SIFIRLAMA
echo  ==============================
echo.
echo  [!] UYARI: Bu islem tum migration dosyalarini silecek!
echo  Devam etmek istiyor musunuz? (E/H)
set /p onay="Onay: "
if /i not "%onay%"=="E" goto VERITABANI_MENU

cd backend\personel-tayin-talebi-api
echo.
echo  1. Migrations klasoru siliniyor...
rmdir /s /q Migrations
echo  2. Yeni Migrations klasoru olusturuluyor...
mkdir Migrations
echo.
set /p migration_name="Yeni ilk migration ismi: "
echo  3. Ilk migration olusturuluyor: %migration_name%
dotnet ef migrations add %migration_name%
echo.
echo  4. Veritabani guncelleniyor...
dotnet ef database update
echo.
echo  Islem tamamlandi!
pause
cd ..\..
goto VERITABANI_MENU

REM --- Tam Veritabanı Sıfırlama İşlemi ---
:DB_TAM_SIFIRLAMA
cls
echo.
echo  TAM VERITABANI SIFIRLAMA
echo  ======================
echo.
echo  [!] UYARI: Bu islem tum migration dosyalarini VE veritabanini silecek!
echo  Devam etmek istiyor musunuz? (E/H)
set /p onay="Onay: "
if /i not "%onay%"=="E" goto VERITABANI_MENU

cd backend\personel-tayin-talebi-api
echo.
echo  1. Migrations klasoru siliniyor...
rmdir /s /q Migrations
echo  2. Yeni Migrations klasoru olusturuluyor...
mkdir Migrations
echo.
set /p migration_name="Yeni ilk migration ismi: "
echo  3. Ilk migration olusturuluyor: %migration_name%
dotnet ef migrations add %migration_name%
echo.
echo  4. Veritabani siliniyor...
dotnet ef database drop --force
echo  5. Yeni veritabani olusturuluyor...
dotnet ef database update
echo.
echo  Islem tamamlandi!
pause
cd ..\..
goto VERITABANI_MENU

REM ===================================================================
REM  TEMIZLIK ISLEMLERI
REM ===================================================================
:TEMIZLIK_YAP
cls
echo.
echo  LOG, OBJ VE BIN DIZINLERINI TEMIZLEME
echo  ====================================
echo.
echo  [!] UYARI: Bu islem tum log dosyalarini, obj ve bin klasorlerini silecek!
echo  Devam etmek istiyor musunuz? (E/H)
set /p onay="Onay: "
if /i not "%onay%"=="E" goto ANA_MENU

echo.
echo  Temizlik islemi basliyor...
echo.

REM Backend temizlik işlemleri
echo  [1/5] Backend log dosyalari temizleniyor...
if exist "backend\personel-tayin-talebi-api\Logs" (
    rmdir /s /q "backend\personel-tayin-talebi-api\Logs"
    mkdir "backend\personel-tayin-talebi-api\Logs"
    echo     Log klasoru temizlendi.
) else (
    echo     Log klasoru bulunamadi, yeni klasor olusturuluyor...
    mkdir "backend\personel-tayin-talebi-api\Logs"
)

echo  [2/5] Backend obj klasoru temizleniyor...
if exist "backend\personel-tayin-talebi-api\obj" (
    rmdir /s /q "backend\personel-tayin-talebi-api\obj"
    echo     Obj klasoru temizlendi.
) else (
    echo     Obj klasoru bulunamadi, atlaniyor.
)

echo  [3/5] Backend bin klasoru temizleniyor...
if exist "backend\personel-tayin-talebi-api\bin" (
    rmdir /s /q "backend\personel-tayin-talebi-api\bin"
    echo     Bin klasoru temizlendi.
) else (
    echo     Bin klasoru bulunamadi, atlaniyor.
)

REM Frontend temizlik işlemleri
echo  [4/5] Frontend build klasoru temizleniyor...
if exist "frontend\personel-tayin-talebi-ui\build" (
    rmdir /s /q "frontend\personel-tayin-talebi-ui\build"
    echo     Build klasoru temizlendi.
) else (
    echo     Build klasoru bulunamadi, atlaniyor.
)

echo  [5/5] Frontend log dosyalari temizleniyor...
if exist "frontend\personel-tayin-talebi-ui\npm-debug.log*" (
    del /q "frontend\personel-tayin-talebi-ui\npm-debug.log*"
    echo     npm-debug.log dosyalari temizlendi.
)
if exist "frontend\personel-tayin-talebi-ui\yarn-debug.log*" (
    del /q "frontend\personel-tayin-talebi-ui\yarn-debug.log*"
    echo     yarn-debug.log dosyalari temizlendi.
)
if exist "frontend\personel-tayin-talebi-ui\yarn-error.log*" (
    del /q "frontend\personel-tayin-talebi-ui\yarn-error.log*"
    echo     yarn-error.log dosyalari temizlendi.
)

echo.
echo  Temizlik islemi tamamlandi!
echo.
pause
goto ANA_MENU

REM ===================================================================
REM  PROGRAM CIKISI
REM ===================================================================
:CIKIS
cls
echo.
echo  PERSONEL TAYIN TALEBI UYGULAMASI
echo  ===============================
echo.
echo  Program sonlandirildi. Iyi gunler!
echo.
timeout /t 3 >nul 