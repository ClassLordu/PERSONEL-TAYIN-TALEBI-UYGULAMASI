import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, CircularProgress, Alert, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tooltip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Divider, TextField, FormControl, InputLabel, Select, MenuItem, Grid, TablePagination, Autocomplete
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import apiService from '../services/apiService';

const getStatusChip = (status) => {
  const statusColors = { 'Beklemede': 'warning', 'Onaylandı': 'success', 'Reddedildi': 'error' };
  return <Chip label={status} color={statusColors[status] || 'default'} size="small" />;
};

function TalepDetayModal({ open, onClose, talep }) {
    if (!talep) return null;
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Talep Detayları</DialogTitle>
            <DialogContent dividers>
                <Typography gutterBottom><strong>Talep Tarihi:</strong> {new Date(talep.talepTarihi).toLocaleDateString()}</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography gutterBottom><strong>Gerekçeniz:</strong></Typography>
                <Typography gutterBottom color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>{talep.gerekce || "Belirtilmemiş"}</Typography>
                {talep.durum !== 'Beklemede' && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography gutterBottom><strong>Karar Durumu:</strong> {talep.durum}</Typography>
                        <Typography gutterBottom><strong>Karar Tarihi:</strong> {new Date(talep.kararTarihi).toLocaleDateString()}</Typography>
                        <Typography gutterBottom><strong>Atandığınız Yer:</strong> {talep.atananAdliye || "-"}</Typography>
                        <Typography gutterBottom><strong>Karar Açıklaması:</strong></Typography>
                        <Typography gutterBottom color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>{talep.kararAciklamasi || "Belirtilmemiş"}</Typography>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Kapat</Button>
            </DialogActions>
        </Dialog>
    );
}

function TaleplerimPage() {
  const [talepler, setTalepler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTalepler, setSelectedTalepler] = useState(null);
  const [detayModalOpen, setDetayModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    apiService.getTaleplerim()
      .then(response => { setTalepler(response.data || []); })
      .catch(err => { setError('Talepleriniz yüklenirken bir hata oluştu.'); console.error(err); })
      .finally(() => { setLoading(false); });
  }, []);

  const handlePageChange = (event, newPage) => { 
    setPage(newPage); 
  };
  
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openDetayModal = (talep) => { setSelectedTalepler(talep); setDetayModalOpen(true); };
  
  const filteredTalepler = talepler
    .filter(talep => statusFilter ? talep.durum === statusFilter : true)
    .filter(talep => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      const tercihler = Array.isArray(talep.talepEdilenAdliyeler)
        ? talep.talepEdilenAdliyeler.map(t => t.ad).join(', ')
        : '';
      return (
        talep.mevcutAdliye?.toLowerCase().includes(searchLower) ||
        tercihler.toLowerCase().includes(searchLower) ||
        talep.atananAdliye?.toLowerCase().includes(searchLower)
      );
    });

  const paginatedTalepler = filteredTalepler.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>Taleplerim</Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <TextField
              fullWidth
              label="Ara (Mevcut Görev Yeri, Tercihler, Atanılan Yer)"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(0);}}
            />
          </Grid>
          <Grid item xs="auto">
            <Autocomplete
                options={["Beklemede", "Onaylandı", "Reddedildi"]}
                value={statusFilter || null}
                onChange={(event, newValue) => {
                    setStatusFilter(newValue || '');
                    setPage(0);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Durum Filtrele"
                        variant="outlined"
                        sx={{ minWidth: 240 }}
                    />
                )}
            />
          </Grid>
        </Grid>
      </Paper>

      {talepler.length === 0 && !loading ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}><Typography>Henüz oluşturulmuş bir tayin talebiniz bulunmamaktadır.</Typography></Paper>
      ) : paginatedTalepler.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}><Typography>Filtre kriterlerine uygun talep bulunamadı.</Typography></Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="taleplerim tablosu">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '5%' }}>Sıra No</TableCell>
                  <TableCell>Talep Tarihi</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Mevcut Görev Yeri</TableCell>
                  <TableCell>Tercihler</TableCell>
                  <TableCell>Atanılan Yer</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTalepler.map((talep, index) => (
                  <TableRow key={talep.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell component="th" scope="row">{new Date(talep.talepTarihi).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusChip(talep.durum)}</TableCell>
                    <TableCell>{talep.mevcutAdliye}</TableCell>
                    <TableCell>
                      {Array.isArray(talep.talepEdilenAdliyeler)
                        ? talep.talepEdilenAdliyeler.map(t => `${t.sira}. ${t.ad}`).join(', ')
                        : '-'}
                    </TableCell>
                    <TableCell>{talep.atananAdliye || '-'}</TableCell>
                    <TableCell>
                      <Tooltip title="Detayları Gör"><IconButton onClick={() => openDetayModal(talep)} size="small"><InfoIcon /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={filteredTalepler.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                labelRowsPerPage="Sayfa başına talep:"
            />
          </TableContainer>
        </>
      )}
      <TalepDetayModal open={detayModalOpen} onClose={() => setDetayModalOpen(false)} talep={selectedTalepler} />
    </Container>
  );
}

export default TaleplerimPage;
