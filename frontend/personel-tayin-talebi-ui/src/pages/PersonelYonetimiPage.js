import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert,
  Button, IconButton, Tooltip, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, DialogContentText, Select, MenuItem, InputLabel, FormControl, TablePagination, Grid, Autocomplete
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';

function PersonelYonetimiPage() {
  const [personeller, setPersoneller] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPersonel, setCurrentPersonel] = useState(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [personelToDelete, setPersonelToDelete] = useState(null);

  const [unvanlar, setUnvanlar] = useState([]);
  const [adliyeler, setAdliyeler] = useState([]);
  const { user, refreshAuthUser } = useAuth();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [unvanFilter, setUnvanFilter] = useState('');
  const [adliyeFilter, setAdliyeFilter] = useState('');

  const fetchPersoneller = () => {
    setLoading(true);
    apiService.getAllPersonel()
      .then(response => {
        setPersoneller(response.data);
      })
      .catch(err => {
        setError('Personel listesi yüklenirken bir hata oluştu.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPersoneller();
    apiService.getUnvanlar().then(res => setUnvanlar(res.data));
    apiService.getAdliyeler().then(res => setAdliyeler(res.data));
  }, []);

  const handleOpenModal = (personel = null) => {
    setError('');
    if (personel) {
      setIsEditMode(true);
      setCurrentPersonel({
          id: personel.id,
          sicilNumarasi: personel.sicilNumarasi,
          ad: personel.ad,
          soyad: personel.soyad,
          unvanId: personel.unvanId || '',
          mevcutAdliyeId: personel.mevcutAdliyeId || '',
          baslamaTarihi: new Date(personel.iseBaslamaTarihi).toISOString().split('T')[0] || '',
          password: '' // Keep password blank for editing
      });
    } else {
      setIsEditMode(false);
      setCurrentPersonel({ sicilNumarasi: '', ad: '', soyad: '', unvanId: '', mevcutAdliyeId: '', baslamaTarihi: '', password: '' });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentPersonel(null);
  };

  const handleSave = () => {
    // For edit mode, if password is blank, don't send it
    const personelData = { ...currentPersonel };
    if (isEditMode && !personelData.password) {
      delete personelData.password;
    }

    const promise = isEditMode
      ? apiService.updatePersonel(personelData.id, personelData)
      : apiService.createPersonel(personelData);

    promise
      .then(() => {
        fetchPersoneller();
        handleCloseModal();
        if (isEditMode && user && personelData.id === user.id) {
          refreshAuthUser();
        }
      })
      .catch(err => {
        setError(err.response?.data?.message || err.response?.data || 'İşlem sırasında bir hata oluştu.');
      });
  };

  const handleDeleteClick = (personel) => {
    setPersonelToDelete(personel);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    apiService.deletePersonel(personelToDelete.id)
      .then(() => {
        fetchPersoneller();
        setDeleteDialogOpen(false);
      })
      .catch(err => {
        setError('Personel silinirken bir hata oluştu.');
        setDeleteDialogOpen(false);
      });
  };

  const filteredPersoneller = personeller
  .filter(personel => {
      const searchString = `${personel.sicilNumarasi} ${personel.ad} ${personel.soyad} ${personel.unvan || ''} ${personel.mevcutAdliye || ''}`.toLowerCase();
      return searchString.includes(searchTerm.toLowerCase());
  })
  .filter(personel => {
      return unvanFilter ? personel.unvanId === unvanFilter : true;
  })
  .filter(personel => {
      return adliyeFilter ? personel.mevcutAdliyeId === adliyeFilter : true;
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Personel Yönetimi
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
            Yeni Personel Ekle
          </Button>
        </Box>
        <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Personel Ara (Sicil, Ad, Soyad...)"
                        value={searchTerm}
                        onChange={(e) => {setSearchTerm(e.target.value); setPage(0);}}
                    />
                </Grid>
                <Grid item xs="auto">
                    <Autocomplete
                        options={unvanlar}
                        getOptionLabel={(option) => option.ad || ''}
                        value={unvanlar.find(u => u.id === unvanFilter) || null}
                        onChange={(event, newValue) => {
                            setUnvanFilter(newValue ? newValue.id : '');
                            setPage(0);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Unvana Göre Filtrele"
                                variant="outlined"
                                sx={{ minWidth: 200 }}
                            />
                        )}
                    />
                </Grid>
                <Grid item xs="auto">
                    <Autocomplete
                        options={adliyeler}
                        getOptionLabel={(option) => option.ad || ''}
                        value={adliyeler.find(a => a.id === adliyeFilter) || null}
                        onChange={(event, newValue) => {
                            setAdliyeFilter(newValue ? newValue.id : '');
                            setPage(0);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Görev Yerine Göre Filtrele"
                                variant="outlined"
                                sx={{ minWidth: 200 }}
                            />
                        )}
                    />
                </Grid>
            </Grid>
        </Paper>

        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
        {error && !modalOpen && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        
        {!loading && !error && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '5%', fontWeight: 'bold' }}>Sıra No</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Sicil Numarası</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Ad Soyad</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Unvan</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Görev Yeri</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>İşe Başlama Tarihi</TableCell>
                  <TableCell sx={{ width: '15%', fontWeight: 'bold' }} align="right">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPersoneller.length > 0 ? (
                  filteredPersoneller
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((personel, index) => (
                    <TableRow key={personel.id} hover>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{personel.sicilNumarasi}</TableCell>
                      <TableCell>{`${personel.ad} ${personel.soyad}`}</TableCell>
                      <TableCell>{personel.unvan || 'N/A'}</TableCell>
                      <TableCell>{personel.mevcutAdliye || 'N/A'}</TableCell>
                      <TableCell>{personel.iseBaslamaTarihi ? new Date(personel.iseBaslamaTarihi).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Düzenle">
                          <IconButton onClick={() => handleOpenModal(personel)}><EditIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton onClick={() => handleDeleteClick(personel)} color="error"><DeleteIcon /></IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">Gösterilecek personel bulunamadı.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredPersoneller.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
                labelRowsPerPage="Sayfa başına personel:"
            />
          </TableContainer>
        )}
      </Box>
      
      {/* Ekleme/Düzenleme Modalı */}
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>{isEditMode ? 'Personel Düzenle' : 'Yeni Personel Ekle'}</DialogTitle>
        <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
            <TextField autoFocus margin="dense" label="Sicil Numarası" fullWidth variant="outlined" value={currentPersonel?.sicilNumarasi || ''} onChange={(e) => setCurrentPersonel({ ...currentPersonel, sicilNumarasi: e.target.value })} sx={{mt:1}} />
            <TextField margin="dense" label="Ad" fullWidth variant="outlined" value={currentPersonel?.ad || ''} onChange={(e) => setCurrentPersonel({ ...currentPersonel, ad: e.target.value })} />
            <TextField margin="dense" label="Soyad" fullWidth variant="outlined" value={currentPersonel?.soyad || ''} onChange={(e) => setCurrentPersonel({ ...currentPersonel, soyad: e.target.value })} />
            <FormControl fullWidth margin="dense">
                <InputLabel>Unvan</InputLabel>
                <Select value={currentPersonel?.unvanId || ''} onChange={(e) => setCurrentPersonel({ ...currentPersonel, unvanId: e.target.value })} label="Unvan">
                    {unvanlar.map(u => <MenuItem key={u.id} value={u.id}>{u.ad}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
                <InputLabel>Görev Yeri</InputLabel>
                <Select value={currentPersonel?.mevcutAdliyeId || ''} onChange={(e) => setCurrentPersonel({ ...currentPersonel, mevcutAdliyeId: e.target.value })} label="Görev Yeri">
                    {adliyeler.map(a => <MenuItem key={a.id} value={a.id}>{a.ad}</MenuItem>)}
                </Select>
            </FormControl>
            <TextField margin="dense" label="İşe Başlama Tarihi" type="date" fullWidth variant="outlined" InputLabelProps={{ shrink: true }} value={currentPersonel?.baslamaTarihi || ''} onChange={(e) => setCurrentPersonel({ ...currentPersonel, baslamaTarihi: e.target.value })}/>
            <TextField margin="dense" label="Şifre" type="password" fullWidth variant="outlined" value={currentPersonel?.password || ''} onChange={(e) => setCurrentPersonel({ ...currentPersonel, password: e.target.value })} helperText={isEditMode ? "Değiştirmek istemiyorsanız boş bırakın." : ""}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>İptal</Button>
          <Button onClick={handleSave} variant="contained">{isEditMode ? 'Güncelle' : 'Kaydet'}</Button>
        </DialogActions>
      </Dialog>
      
      {/* Silme Onay Modalı */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Personeli Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu personeli kalıcı olarak silmek istediğinizden emin misiniz? Personele ait tüm tayin talepleri ve kayıtlar da silinecektir. Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={handleConfirmDelete} color="error">Sil</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default PersonelYonetimiPage;
