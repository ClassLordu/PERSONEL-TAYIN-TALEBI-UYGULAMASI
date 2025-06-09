import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Paper, TextField, Button, CircularProgress, Alert, AlertTitle, 
  MenuItem, List, ListItem, ListItemText, IconButton
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { ArrowUpward, ArrowDownward, Delete } from '@mui/icons-material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import apiService from '../services/apiService';
import { useNavigate } from 'react-router-dom';

function TalepOlusturPage() {
  const [adliyeler, setAdliyeler] = useState([]);
  const [secilenAdliyeler, setSecilenAdliyeler] = useState([]);
  const [gerekce, setGerekce] = useState('');
  const [talepTurleri, setTalepTurleri] = useState([]);
  const [talepTuruId, setTalepTuruId] = useState(''); 
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [aktifDonem, setAktifDonem] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      apiService.getAdliyeler(),
      apiService.getMyProfile(),
      apiService.getTalepTurleri(),
      apiService.getTaleplerim(),
      apiService.getAktifTayinDonemi()
    ]).then(([adliyelerResponse, profileResponse, talepTurleriResponse, taleplerimResponse, aktifDonemResponse]) => {
      const pendingRequest = taleplerimResponse.data.find(t => t.durum === 'Beklemede');
      if (pendingRequest) {
        setHasPendingRequest(true);
      }

      setAktifDonem(aktifDonemResponse.data);

      const kullaniciMevcutAdliyeId = profileResponse.data.calismaGecmisleri?.[0]?.adliyeId;
      const filtrelenmisAdliyeler = adliyelerResponse.data.filter(adliye => adliye.id !== kullaniciMevcutAdliyeId);
      setAdliyeler(filtrelenmisAdliyeler);

      setTalepTurleri(talepTurleriResponse.data);
    }).catch(err => {
      setError('Veriler yüklenirken bir hata oluştu.');
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newSecilen = [...secilenAdliyeler];
    const item = newSecilen.splice(index, 1)[0];
    newSecilen.splice(index - 1, 0, item);
    setSecilenAdliyeler(newSecilen);
  };

  const handleMoveDown = (index) => {
    if (index >= secilenAdliyeler.length - 1) return;
    const newSecilen = [...secilenAdliyeler];
    const item = newSecilen.splice(index, 1)[0];
    newSecilen.splice(index + 1, 0, item);
    setSecilenAdliyeler(newSecilen);
  };

  const handleRemoveAdliye = (index) => {
    const newSecilen = [...secilenAdliyeler];
    newSecilen.splice(index, 1);
    setSecilenAdliyeler(newSecilen);
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (secilenAdliyeler.length === 0) {
        setError('Lütfen en az bir görev yeri seçiniz.');
        setLoading(false);
        return;
    }

    if (!talepTuruId) {
        setError('Lütfen bir talep türü seçiniz.');
        setLoading(false);
        return;
    }

    const talepData = {
      talepEdilenAdliyeIds: secilenAdliyeler.map(adliye => adliye.id),
      gerekce,
      talepTuruId: parseInt(talepTuruId, 10),
    };

    apiService.createTalep(talepData)
      .then(() => {
        setLoading(false);
        setSuccess('Talebiniz başarıyla oluşturuldu. Yönlendiriliyorsunuz...');
        setTimeout(() => navigate('/taleplerim'), 2000);
      })
      .catch(err => {
        setError(err.response?.data?.message || err.response?.data || 'Talep oluşturulurken bir hata oluştu.');
        setLoading(false);
      });
  };

  const selectedTalepTuru = talepTurleri.find(t => t.id === talepTuruId);
  const isGerekceRequired = selectedTalepTuru && selectedTalepTuru.ad !== 'İsteğe Bağlı';
  const isVoluntaryRequestBlocked = selectedTalepTuru?.ad === 'İsteğe Bağlı' && !aktifDonem;

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Yeni Tayin Talebi Oluştur
        </Typography>
        
        {hasPendingRequest ? (
          <Alert severity="warning" sx={{ p: 3, textAlign: 'center' }}>
            <AlertTitle sx={{ fontWeight: 'bold' }}>Mevcut Bir Talebiniz Bulunmaktadır</AlertTitle>
            Sistemde zaten sonuçlanmamış bir tayin talebiniz var. Mevcut talebiniz sonuçlanana kadar yeni bir talep oluşturamazsınız.
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/taleplerim')}
              sx={{ mt: 2, display: 'block', mx: 'auto' }}
            >
              Taleplerimi Görüntüle
            </Button>
          </Alert>
        ) : (
          <Paper sx={{ p: 3 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              
              <TextField
                select
                fullWidth
                label="Talep Türü"
                value={talepTuruId}
                onChange={(e) => setTalepTuruId(e.target.value)}
                variant="outlined"
                margin="normal"
                required
              >
                {talepTurleri.map((tur) => (
                  <MenuItem key={tur.id} value={tur.id}>
                    {tur.ad}
                  </MenuItem>
                ))}
              </TextField>

              {isVoluntaryRequestBlocked ? (
                <Alert severity="warning" icon={<ReportProblemIcon />} sx={{ mt: 2, p: 2 }}>
                  <Typography fontWeight="bold">"İsteğe Bağlı" Talep Oluşturulamaz</Typography>
                  Sistemde şu anda aktif bir tayin dönemi bulunmamaktadır. Lütfen daha sonra tekrar deneyin veya farklı bir talep türü seçin.
                </Alert>
              ) : (
                <>
                  {selectedTalepTuru?.ad === 'İsteğe Bağlı' && aktifDonem && (
                    <Alert severity="info" icon={<EventAvailableIcon />} sx={{ mb: 2 }}>
                      <Typography fontWeight="bold">Aktif Tayin Dönemi: {aktifDonem.ad}</Typography>
                      Başlangıç: {new Date(aktifDonem.baslangicTarihi).toLocaleDateString()} - Bitiş: {new Date(aktifDonem.bitisTarihi).toLocaleDateString()}
                    </Alert>
                  )}

                  <Autocomplete
                    multiple
                    id="adliye-secim"
                    options={adliyeler.filter(adliye => !secilenAdliyeler.some(secilen => secilen.id === adliye.id))}
                    getOptionLabel={(option) => option.ad}
                    value={secilenAdliyeler}
                    onChange={(event, newValue) => {
                      if (newValue.length <= 5) {
                         setSecilenAdliyeler(newValue);
                      }
                    }}
                    getOptionDisabled={() => secilenAdliyeler.length >= 5}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Tercih Ekle"
                        placeholder="Adliye arayın ve seçin..."
                        helperText={secilenAdliyeler.length >= 5 ? "En fazla 5 tercih yapabilirsiniz." : ""}
                      />
                    )}
                    sx={{ mt: 2 }}
                  />

                  {secilenAdliyeler.length > 0 && (
                    <Paper variant="outlined" sx={{ mt: 2 }}>
                        <List>
                          <ListItem>
                            <ListItemText primary={<Typography variant="h6">Tercih Sıralaması</Typography>} />
                          </ListItem>
                          {secilenAdliyeler.map((adliye, index) => (
                            <ListItem
                              key={adliye.id}
                              divider
                              secondaryAction={
                                <>
                                  <IconButton edge="end" size="small" aria-label="up" onClick={() => handleMoveUp(index)} disabled={index === 0}>
                                    <ArrowUpward />
                                  </IconButton>
                                  <IconButton edge="end" size="small" aria-label="down" onClick={() => handleMoveDown(index)} disabled={index === secilenAdliyeler.length - 1}>
                                    <ArrowDownward />
                                  </IconButton>
                                  <IconButton edge="end" size="small" aria-label="delete" onClick={() => handleRemoveAdliye(index)} sx={{ ml: 1 }}>
                                    <Delete />
                                  </IconButton>
                                </>
                              }
                            >
                              <ListItemText primary={`${index + 1}. ${adliye.ad}`} />
                            </ListItem>
                          ))}
                        </List>
                    </Paper>
                  )}

                  <TextField
                    label="Gerekçe"
                    multiline
                    rows={4}
                    value={gerekce}
                    onChange={(e) => setGerekce(e.target.value)}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    required={isGerekceRequired}
                    helperText={isGerekceRequired ? "Bu talep türü için gerekçe belirtmek zorunludur." : "Gerekçenizi kısaca açıklayınız (isteğe bağlı)."}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 2, p: 1.5 }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Talebi Gönder'}
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default TalepOlusturPage;
