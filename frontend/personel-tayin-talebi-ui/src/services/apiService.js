import axios from 'axios';

// Backend API'nizin temel adresi güncellendi
const API_BASE_URL = 'http://localhost:5000/api';

// İsteğe göre token'ı headera ekleyen bir axios instance oluşturuyoruz
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


// ================== ACCOUNT SERVİSLERİ ==================

const login = (sicilNumarasi, password) => {
  return apiClient.post('/Account/login', {
    sicilNumarasi,
    password,
  });
};

const logout = () => {
  localStorage.removeItem('user');
};

const changePassword = (passwordData) => {
  return apiClient.post('/Account/change-password', passwordData);
};


// ================== TALEP SERVİSLERİ ==================
const getTaleplerim = () => {
  return apiClient.get('/Talepler/user');
};

const getAllTalepler = (pageNumber = 1, pageSize = 10, status = null) => {
  return apiClient.get('/Talepler', {
    params: { pageNumber, pageSize, status }
  });
};

const createTalep = (talepData) => {
  return apiClient.post('/Talepler', talepData);
};

const onaylaTalep = (id, onayData) => {
  return apiClient.post(`/Talepler/${id}/onayla`, onayData);
};

const reddetTalep = (id, redData) => {
  return apiClient.post(`/Talepler/${id}/reddet`, redData);
};

const getTalepById = (id) => {
  return apiClient.get(`/Talepler/${id}`);
};

// ================== PERSONEL SERVİSLERİ ==================
const getAllPersonel = () => {
  return apiClient.get('/Personel');
};

const getMyProfile = () => {
  return apiClient.get('/Personel/me');
};

const getPersonelById = (id) => {
  return apiClient.get(`/Personel/${id}`);
};

const createPersonel = (personelData) => apiClient.post('/Personel', personelData);
const updatePersonel = (id, personelData) => apiClient.put(`/Personel/${id}`, personelData);
const deletePersonel = (id) => apiClient.delete(`/Personel/${id}`);

// ================== DUYURU SERVİSLERİ ==================
const getDuyurular = () => {
  return apiClient.get('/Duyurular');
};

const getAktifDuyurular = () => apiClient.get('/Duyurular/aktif');
const getAllDuyurular = () => apiClient.get('/Duyurular/all');
const createDuyuru = (duyuruData) => apiClient.post('/Duyurular', duyuruData);
const updateDuyuru = (id, duyuruData) => apiClient.put(`/Duyurular/${id}`, duyuruData);
const deleteDuyuru = (id) => apiClient.delete(`/Duyurular/${id}`);

// ================== ADLİYE SERVİSLERİ ==================
const getAdliyeler = () => {
  return apiClient.get('/Adliyeler');
};

const getAdliye = (id) => {
  return apiClient.get(`/Adliyeler/${id}`);
};

const getTalepTurleri = () => {
  return apiClient.get('/TalepTurleri');
};

// ================== UNVAN SERVİSLERİ ==================
const getUnvanlar = () => {
  return apiClient.get('/Unvanlar');
};

// ================== TAYİN DÖNEMİ SERVİSLERİ ==================
const getTayinDonemleri = () => {
  return apiClient.get('/TayinDonemleri');
};

const getAktifTayinDonemi = () => {
  return apiClient.get('/TayinDonemleri/aktif');
};

const createTayinDonemi = (donemData) => apiClient.post('/TayinDonemleri', donemData);
const updateTayinDonemi = (id, donemData) => apiClient.put(`/TayinDonemleri/${id}`, donemData);
const deleteTayinDonemi = (id) => apiClient.delete(`/TayinDonemleri/${id}`);

// ================== İŞLEM KAYITLARI SERVİSLERİ ==================
const getIslemKayitlari = (pageNumber = 1, pageSize = 15, searchTerm = '', eylemTipi = '') => {
  return apiClient.get('/IslemKayitlari', {
    params: { pageNumber, pageSize, searchTerm, eylemTipi }
  });
};

const getEylemTipleri = () => apiClient.get('/IslemKayitlari/eylem-tipleri');

// Tüm servis fonksiyonlarını tek bir nesne altında topluyoruz
const apiService = {
  // Account
  login,
  logout,
  changePassword,
  
  // Talepler
  getTaleplerim,
  getAllTalepler,
  createTalep,
  onaylaTalep,
  reddetTalep,
  getTalepById,

  // Personel
  getAllPersonel,
  getMyProfile,
  getPersonelById,
  createPersonel,
  updatePersonel,
  deletePersonel,
  
  // Duyurular
  getDuyurular,
  getAktifDuyurular,
  getAllDuyurular,
  createDuyuru,
  updateDuyuru,
  deleteDuyuru,

  // Adliyeler
  getAdliyeler,
  getAdliye,
  getTalepTurleri,

  // Unvanlar
  getUnvanlar,

  // Tayin Donemleri
  getTayinDonemleri,
  getAktifTayinDonemi,
  createTayinDonemi,
  updateTayinDonemi,
  deleteTayinDonemi,

  // İşlem Kayıtları
  getIslemKayitlari,
  getEylemTipleri,
};

export default apiService;