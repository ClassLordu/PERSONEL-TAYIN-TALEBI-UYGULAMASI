import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Button,
  CircularProgress, Alert, IconButton, Tooltip, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, TablePagination, Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import apiService from '../services/apiService';

function TayinDonemiYonetimPage() {
  const [donemler, setDonemler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [currentDonem, setCurrentDonem] = useState({ id: null, ad: '', baslangicTarihi: '', bitisTarihi: '' });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [donemToDelete, setDonemToDelete] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchDonemler = () => {
    setLoading(true);
    apiService.getTayinDonemleri()
      .then(response => {
        setDonemler(response.data);
      })
      .catch(err => {
        setError('Tayin dönemleri yüklenirken bir hata oluştu.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDonemler();
  }, []);

  const handleOpenDialog = (donem = null) => {
    setError('');
    if (donem) {
      setCurrentDonem({
        id: donem.id,
        ad: donem.ad,
        baslangicTarihi: new Date(donem.baslangicTarihi).toISOString().split('T')[0],
        bitisTarihi: new Date(donem.bitisTarihi).toISOString().split('T')[0],
      });
    } else {
      setCurrentDonem({ id: null, ad: '', baslangicTarihi: '', bitisTarihi: '' });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSave = () => {
    const promise = currentDonem.id
      ? apiService.updateTayinDonemi(currentDonem.id, currentDonem)
      : apiService.createTayinDonemi(currentDonem);

    promise
      .then(() => {
        fetchDonemler();
        handleCloseDialog();
      })
      .catch(err => {
        setError(err.response?.data?.message || 'İşlem sırasında bir hata oluştu.');
      });
  };

  const handleDeleteClick = (donem) => {
    setDonemToDelete(donem);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!donemToDelete) return;
    
    apiService.deleteTayinDonemi(donemToDelete.id)
      .then(() => {
        fetchDonemler();
        setDeleteDialogOpen(false);
        setDonemToDelete(null);
      })
      .catch(err => {
        setError('Silme işlemi başarısız.');
        setDeleteDialogOpen(false);
      });
  };

  const filteredDonemler = donemler
    .filter(donem =>
        donem.ad.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(donem => {
        if (!startDate || !endDate) return true;
        const donemBaslangic = new Date(donem.baslangicTarihi);
        const donemBitis = new Date(donem.bitisTarihi);
        const filterBaslangic = new Date(startDate);
        const filterBitis = new Date(endDate);
        return donemBaslangic >= filterBaslangic && donemBitis <= filterBitis;
    });

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Tayin Dönemi Yönetimi
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Yeni Dönem Ekle
          </Button>
        </Box>

        <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Dönem Ara (Dönem Adı)"
                        value={searchTerm}
                        onChange={(e) => {setSearchTerm(e.target.value); setPage(0);}}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Başlangıç Tarihi"
                        value={startDate}
                        onChange={(e) => {setStartDate(e.target.value); setPage(0);}}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Bitiş Tarihi"
                        value={endDate}
                        onChange={(e) => {setEndDate(e.target.value); setPage(0);}}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
            </Grid>
        </Paper>

        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
        {error && !loading && <Alert severity="error">{error}</Alert>}
        {!loading && !error && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{width: '5%', fontWeight: 'bold'}}>Sıra No</TableCell>
                    <TableCell sx={{fontWeight: 'bold'}}>Dönem Adı</TableCell>
                    <TableCell sx={{fontWeight: 'bold'}}>Başlangıç Tarihi</TableCell>
                    <TableCell sx={{fontWeight: 'bold'}}>Bitiş Tarihi</TableCell>
                    <TableCell sx={{width: '15%', fontWeight: 'bold'}} align="right">İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDonemler.length > 0 ? (
                    filteredDonemler
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((donem, index) => (
                      <TableRow key={donem.id} hover>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{donem.ad}</TableCell>
                        <TableCell>{new Date(donem.baslangicTarihi).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(donem.bitisTarihi).toLocaleDateString()}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Düzenle">
                            <IconButton onClick={() => handleOpenDialog(donem)}><EditIcon /></IconButton>
                          </Tooltip>
                          <Tooltip title="Sil">
                            <IconButton onClick={() => handleDeleteClick(donem)} color="error"><DeleteIcon /></IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                        <TableCell colSpan={5} align="center">
                            Gösterilecek tayin dönemi bulunamadı.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredDonemler.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(0);
                }}
                labelRowsPerPage="Sayfa başına dönem:"
               />
            </TableContainer>
        )}
      </Box>

      {/* Ekleme/Düzenleme Modalı */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{currentDonem.id ? 'Dönemi Düzenle' : 'Yeni Dönem Ekle'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Dönem Adı"
            type="text"
            fullWidth
            variant="outlined"
            value={currentDonem.ad}
            onChange={(e) => setCurrentDonem({ ...currentDonem, ad: e.target.value })}
            sx={{mt: 1}}
          />
          <TextField
            margin="dense"
            label="Başlangıç Tarihi"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={currentDonem.baslangicTarihi}
            onChange={(e) => setCurrentDonem({ ...currentDonem, baslangicTarihi: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Bitiş Tarihi"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={currentDonem.bitisTarihi}
            onChange={(e) => setCurrentDonem({ ...currentDonem, bitisTarihi: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Vazgeç</Button>
          <Button onClick={handleSave} variant="contained">Kaydet</Button>
        </DialogActions>
      </Dialog>
      
      {/* Silme Onay Modalı */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Tayin Dönemini Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu tayin dönemini kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>İptal</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default TayinDonemiYonetimPage; 