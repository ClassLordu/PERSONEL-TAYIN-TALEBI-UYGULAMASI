import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Button, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Tooltip, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, TextField, Switch, FormControlLabel, TablePagination,
  Grid, FormControl, InputLabel, Select, MenuItem, Autocomplete
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import apiService from '../services/apiService';

const DuyuruYonetimPage = () => {
  const [duyurular, setDuyurular] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [currentDuyuru, setCurrentDuyuru] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [duyuruToDelete, setDuyuruToDelete] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchDuyurular();
  }, []);

  const fetchDuyurular = () => {
    setLoading(true);
    apiService.getAllDuyurular()
      .then(response => {
        setDuyurular(response.data);
      })
      .catch(err => {
        setError('Duyurular yüklenirken bir hata oluştu.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  const handleOpenModal = (duyuru = null) => {
    if (duyuru) {
      setCurrentDuyuru({ ...duyuru });
      setIsEditMode(true);
    } else {
      setCurrentDuyuru({ baslik: '', icerik: '', aktifMi: true });
      setIsEditMode(false);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentDuyuru(null);
  };

  const handleSave = () => {
    const duyuruData = {
      baslik: currentDuyuru.baslik,
      icerik: currentDuyuru.icerik,
      aktifMi: currentDuyuru.aktifMi,
    };

    const apiCall = isEditMode
      ? apiService.updateDuyuru(currentDuyuru.id, currentDuyuru)
      : apiService.createDuyuru(duyuruData);

    apiCall
      .then(() => {
        fetchDuyurular();
        handleCloseModal();
      })
      .catch(err => {
        console.error('Kaydetme hatası:', err.response?.data || err.message);
        setError('Duyuru kaydedilirken bir hata oluştu.');
      });
  };

  const handleDeleteClick = (duyuru) => {
    setDuyuruToDelete(duyuru);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!duyuruToDelete) return;

    apiService.deleteDuyuru(duyuruToDelete.id)
      .then(() => {
        fetchDuyurular();
      })
      .catch(err => {
        console.error('Silme işlemi sırasında hata:', err);
        setError('Duyuru silinirken bir hata oluştu.');
      })
      .finally(() => {
        setDeleteModalOpen(false);
        setDuyuruToDelete(null);
      });
  };
  
  const handleToggleStatus = (duyuru) => {
    const updatedStatus = !duyuru.aktifMi;
    apiService.updateDuyuru(duyuru.id, { ...duyuru, aktifMi: updatedStatus })
        .then(() => {
            fetchDuyurular();
        })
        .catch(err => {
            console.error('Durum güncelleme hatası:', err);
            setError('Durum güncellenirken bir hata oluştu.');
        });
  };

  const filteredDuyurular = duyurular
    .filter(duyuru =>
        duyuru.baslik.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(duyuru => {
        if (statusFilter === '') return true;
        return statusFilter === 'aktif' ? duyuru.aktifMi : !duyuru.aktifMi;
    });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Duyuru Yönetimi
        </Typography>
        <Button variant="contained" onClick={() => handleOpenModal()}>
          Yeni Duyuru Ekle
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Duyuru Ara (Başlık)"
                    value={searchTerm}
                    onChange={(e) => {setSearchTerm(e.target.value); setPage(0);}}
                />
            </Grid>
            <Grid item xs="auto">
                <Autocomplete
                    options={[{ value: 'aktif', label: 'Aktif' }, { value: 'pasif', label: 'Pasif' }]}
                    getOptionLabel={(option) => option.label}
                    value={statusFilter ? { value: statusFilter, label: statusFilter === 'aktif' ? 'Aktif' : 'Pasif' } : null}
                    onChange={(event, newValue) => {
                        setStatusFilter(newValue ? newValue.value : '');
                        setPage(0);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Duruma Göre Filtrele"
                            variant="outlined"
                            sx={{ minWidth: 240 }}
                        />
                    )}
                    ListboxProps={{ style: { maxHeight: '150px' } }}
                    renderOption={(props, option) => (
                        <MenuItem {...props} key={option.value}>
                            {option.label}
                        </MenuItem>
                    )}
                    onInputChange={(event, newInputValue, reason) => {
                        if (reason === 'clear') {
                            setStatusFilter('');
                            setPage(0);
                        }
                    }}
                />
            </Grid>
        </Grid>
      </Paper>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '5%' }}>Sıra No</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Başlık</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Durum</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Yayın Tarihi</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '15%' }} align="right">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDuyurular.length > 0 ? (
                  filteredDuyurular
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((duyuru, index) => (
                    <TableRow key={duyuru.id} hover>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{duyuru.baslik}</TableCell>
                      <TableCell>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={duyuru.aktifMi}
                              onChange={() => handleToggleStatus(duyuru)}
                              color="primary"
                            />
                          }
                          label={duyuru.aktifMi ? 'Aktif' : 'Pasif'}
                        />
                      </TableCell>
                      <TableCell>{new Date(duyuru.yayinTarihi).toLocaleString()}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Düzenle">
                          <IconButton onClick={() => handleOpenModal(duyuru)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton onClick={() => handleDeleteClick(duyuru)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Gösterilecek duyuru bulunamadı.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredDuyurular.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
              }}
              labelRowsPerPage="Sayfa başına duyuru:"
          />
        </Paper>
      )}

      {/* Ekleme/Düzenleme Modalı */}
      <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>{isEditMode ? 'Duyuru Düzenle' : 'Yeni Duyuru Ekle'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Başlık"
            type="text"
            fullWidth
            variant="outlined"
            value={currentDuyuru?.baslik || ''}
            onChange={(e) => setCurrentDuyuru({ ...currentDuyuru, baslik: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="İçerik"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={currentDuyuru?.icerik || ''}
            onChange={(e) => setCurrentDuyuru({ ...currentDuyuru, icerik: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
             control={
                <Switch
                    checked={currentDuyuru?.aktifMi || false}
                    onChange={(e) => setCurrentDuyuru({ ...currentDuyuru, aktifMi: e.target.checked })}
                    name="aktifMi"
                    color="primary"
                />
            }
            label="Duyuru Aktif Olsun"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>İptal</Button>
          <Button onClick={handleSave} variant="contained">{isEditMode ? 'Güncelle' : 'Kaydet'}</Button>
        </DialogActions>
      </Dialog>

      {/* Silme Onay Modalı */}
      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <DialogTitle>Duyuruyu Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu duyuruyu kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)}>İptal</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DuyuruYonetimPage; 