import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PersonelPage from './pages/PersonelPage';
import TaleplerimPage from './pages/TaleplerimPage';
import TalepOlusturPage from './pages/TalepOlusturPage';
import YetkiliPage from './pages/YetkiliPage';
import IslemKayitlariPage from './pages/IslemKayitlariPage';
import ProfilimPage from './pages/ProfilimPage';
import NotFoundPage from './pages/NotFoundPage';
import PersonelYonetimiPage from './pages/PersonelYonetimiPage';
import TayinDonemiYonetimPage from './pages/TayinDonemiYonetimPage';
import DuyuruYonetimPage from './pages/DuyuruYonetimPage';

// İkonları import ediyoruz
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CampaignIcon from '@mui/icons-material/Campaign';

export const routesConfig = [
  {
    path: '/',
    element: <HomePage />,
    title: 'Anasayfa - Personel Tayin Talep Sistemi',
    roles: [], // Herkese açık hale getirildi
    inMenu: true, // Menüde görünsün
    icon: <HomeIcon />, // Anasayfa ikonu
  },
  {
    path: '/giris',
    element: <LoginPage />,
    title: 'Giriş Yap - Personel Tayin Talep Sistemi',
    roles: [], // Herkese açık
    inMenu: false, // Menüde görünmesin
  },
  {
    path: '/panel',
    element: <PersonelPage />,
    title: 'Kontrol Paneli - Personel Tayin Talep Sistemi',
    roles: ['personel', 'yetkili'], // Burası zaten doğru
    inMenu: true,
    icon: <DashboardIcon />,
  },
  {
    path: '/taleplerim',
    element: <TaleplerimPage />,
    title: 'Taleplerim - Personel Tayin Talep Sistemi',
    roles: ['personel', 'yetkili'], // DÜZELTME: 'yetkili' rolü eklendi
    inMenu: true,
    icon: <ListAltIcon />,
  },
  {
    path: '/talep-olustur',
    element: <TalepOlusturPage />,
    title: 'Yeni Talep Oluştur - Personel Tayin Talep Sistemi',
    roles: ['personel', 'yetkili'], // DÜZELTME: 'yetkili' rolü eklendi
    inMenu: true,
    icon: <PostAddIcon />,
  },
  {
    path: '/yetkili/tayin-yonetim',
    element: <YetkiliPage />,
    title: 'Tayin Yönetimi - Yetkili Paneli',
    roles: ['yetkili'], // Roller küçük harfe çevrildi
    inMenu: true,
    icon: <FactCheckIcon />,
  },
  {
    path: '/admin/islem-kayitlari',
    element: <IslemKayitlariPage />,
    title: 'İşlem Kayıtları - Yönetici Paneli',
    roles: ['yetkili'],
    inMenu: true,
    icon: <HistoryIcon />,
  },
  {
    path: '/profilim',
    element: <ProfilimPage />,
    title: 'Profilim - Personel Tayin Talep Sistemi',
    roles: ['personel', 'yetkili'],
    inMenu: true,
    icon: <AccountCircleIcon />,
  },
  {
    path: '/yetkili/personel-yonetimi',
    element: <PersonelYonetimiPage />,
    title: 'Personel Yönetimi - Personel Tayin Talep Sistemi',
    roles: ['yetkili'], // Sadece yetkililer erişebilir
    inMenu: true, // Changed to true
    icon: <PeopleIcon />,
  },
  {
    path: '/yetkili/tayin-donemi-yonetimi',
    element: <TayinDonemiYonetimPage />,
    title: 'Tayin Dönemi Yönetimi - Personel Tayin Talep Sistemi',
    roles: ['yetkili'], // Sadece yetkililer erişebilir
    inMenu: true, // Changed to true
    icon: <CalendarMonthIcon />,
  },
  {
    path: '/yetkili/duyuru-yonetimi',
    element: <DuyuruYonetimPage />,
    title: 'Duyuru Yönetimi - Personel Tayin Talep Sistemi',
    roles: ['yetkili'], // Sadece yetkililer erişebilir
    inMenu: true, // Changed to true
    icon: <CampaignIcon />,
  },
  {
    path: '/404', 
    element: <NotFoundPage />,
    title: 'Sayfa Bulunamadı - Personel Tayin Talep Sistemi',
    roles: [], // Herkes erişebilir
    inMenu: false, // Menüde görünmesin
  },
  // Gelecekteki tüm yeni sayfalarınızı buraya ekleyebilirsiniz
  // {
  //   path: '/taleplerim',
  //   element: <TaleplerimPage />,
  //   title: 'Taleplerim - Personel Tayin Talep Sistemi',
  // },
];
