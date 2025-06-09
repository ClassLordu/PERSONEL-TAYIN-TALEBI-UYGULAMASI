import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, Tooltip, IconButton,
  CircularProgress, Alert, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
  Pagination, Tabs, Tab, Divider, TablePagination
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const getStatusChip = (status) => {
    const statusColors = {
      'Beklemede': 'warning',
      'Onaylandı': 'success',
      'Reddedildi': 'error',
    };
    return <Chip label={status} color={statusColors[status] || 'default'} size="small" />;
};

const STATUS_TABS = ["Beklemede", "Onaylandı", "Reddedildi"];

function OnayModal({ open, onClose, talep, onConfirm, loading, error }) {
  const [atananAdliyeId, setAtananAdliyeId] = useState('');
  const [kararAciklamasi, setKararAciklamasi] = useState('');

  useEffect(() => {
    if (open && talep) {
      const firstChoiceId = talep.talepEdilenAdliyeler?.[0]?.adliyeId;
      setAtananAdliyeId(firstChoiceId != null ? firstChoiceId.toString() : '');
      setKararAciklamasi('');
    } else if (!open) {
      setAtananAdliyeId('');
      setKararAciklamasi('');
    }
  }, [open, talep]);

  if (!open) return null;

  const handleConfirm = () => {
    if (!talep) return;
    onConfirm(talep.id, {
      atananAdliyeId: parseInt(atananAdliyeId, 10),
      kararAciklamasi,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Talebi Onayla: {loading ? 'Yükleniyor...' : (talep?.personelAdi || '')}</DialogTitle>
      <DialogContent>
        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}><CircularProgress /></Box>}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && talep && (
          <>
            <FormControl component="fieldset" margin="normal" fullWidth>
              <FormLabel component="legend">Personelin Tercihleri (Atanacak Görev Yerini Seçin)</FormLabel>
              <RadioGroup
                aria-label="atanan-adliye"
                name="atanan-adliye-group"
                value={atananAdliyeId}
                onChange={(e) => setAtananAdliyeId(e.target.value)}
              >
                {talep.talepEdilenAdliyeler?.map((tercih) => 
                  tercih?.adliyeId != null && (
                    <FormControlLabel 
                      key={tercih.adliyeId} 
                      value={tercih.adliyeId.toString()} 
                      control={<Radio />} 
                      label={`${tercih.siraNumarasi}. ${tercih.ad}`} 
                    />
                  )
                )}
              </RadioGroup>
            </FormControl>
            <TextField
              margin="dense"
              id="kararAciklamasi"
              label="Karar Açıklaması"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={kararAciklamasi}
              onChange={(e) => setKararAciklamasi(e.target.value)}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button onClick={handleConfirm} variant="contained" color="success" disabled={loading || !atananAdliyeId}>
          Onayla ve Ata
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function RedModal({ open, onClose, talep, onConfirm }) {
  const [kararAciklamasi, setKararAciklamasi] = useState('');

  useEffect(() => {
    if (open) {
      setKararAciklamasi('');
    }
  }, [open]);

  if (!talep) return null;

  const handleConfirm = () => {
    onConfirm({ kararAciklamasi });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Talebi Reddet: {talep.personelAdi}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="kararAciklamasi"
          label="Red Gerekçesi"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          rows={4}
          value={kararAciklamasi}
          onChange={(e) => setKararAciklamasi(e.target.value)}
          helperText="Lütfen red gerekçesini detaylı bir şekilde açıklayınız."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>İptal</Button>
        <Button onClick={handleConfirm} variant="contained" color="error" disabled={!kararAciklamasi.trim()}>
          Reddet
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function TalepDetayModal({ open, onClose, talep }) {
    if (!talep) return null;
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Talep Detayları</DialogTitle>
            <DialogContent dividers>
                <Typography variant="h6" gutterBottom>{talep.personelAdi} ({talep.personelSicil})</Typography>
                <Typography gutterBottom><strong>Unvan:</strong> {talep.unvan}</Typography>
                <Typography gutterBottom><strong>Talep Tarihi:</strong> {new Date(talep.talepTarihi).toLocaleDateString()}</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography gutterBottom><strong>Gerekçe:</strong></Typography>
                <Typography gutterBottom color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>{talep.gerekce || "Belirtilmemiş"}</Typography>
                {talep.durum !== 'Beklemede' && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography gutterBottom><strong>Karar Durumu:</strong> {talep.durum}</Typography>
                        <Typography gutterBottom><strong>Karar Tarihi:</strong> {new Date(talep.kararTarihi).toLocaleDateString()}</Typography>
                        <Typography gutterBottom><strong>Atandığı Yer:</strong> {talep.atananAdliye || "-"}</Typography>
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

function YetkiliPage() {
  const [allTalepler, setAllTalepler] = useState([]);
  const [filteredTalepler, setFilteredTalepler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedTalep, setSelectedTalep] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [onayModalOpen, setOnayModalOpen] = useState(false);
  const [redModalOpen, setRedModalOpen] = useState(false);
  const [detayModalOpen, setDetayModalOpen] = useState(false);
  
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  
  const fetchTalepler = () => {
    setLoading(true);
    apiService.getAllTalepler(1, 10000, null) 
      .then(response => {
        setAllTalepler(response.data.data || []);
      })
      .catch(err => setError('Talepler yüklenirken bir hata oluştu.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTalepler();
  }, []);

  useEffect(() => {
    const currentStatus = STATUS_TABS[activeTab];
    let filtered = allTalepler.filter(talep => talep.durum === currentStatus);

    if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(talep => 
            (talep.personelAdi?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
            (talep.personelSicil?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
            (talep.unvan?.toLowerCase() || '').includes(lowerCaseSearchTerm) ||
            (talep.talepEdilenAdliyeler?.map(t => t.ad).join(', ') || '').toLowerCase().includes(lowerCaseSearchTerm)
        );
    }
    
    setFilteredTalepler(filtered);
    setPage(0);
  }, [activeTab, allTalepler, searchTerm]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const openOnayModal = (talep) => {
    setOnayModalOpen(true);
    setModalLoading(true);
    setModalError('');
    setSelectedTalep(null); 

    apiService.getTalepById(talep.id)
      .then(response => {
        setSelectedTalep(response.data);
      })
      .catch(err => {
        setModalError('Talep detayları yüklenirken bir hata oluştu.');
        console.error(err);
      })
      .finally(() => {
        setModalLoading(false);
      });
  };

  const openRedModal = (talep) => {
    setSelectedTalep(talep);
    setRedModalOpen(true);
  };

  const openDetayModal = (talep) => {
    setSelectedTalep(talep);
    setDetayModalOpen(true);
  };
  
  const handleOnayla = (talepId, onayData) => {
    if (!talepId) return;
    apiService.onaylaTalep(talepId, onayData)
        .then(() => {
            setOnayModalOpen(false);
            fetchTalepler();
        })
        .catch(err => alert('Onay işlemi sırasında bir hata oluştu: ' + (err.response?.data?.message || err.message)));
  };

  const handleReddet = (redData) => {
    if (!selectedTalep) return;
    apiService.reddetTalep(selectedTalep.id, redData)
        .then(() => {
            setRedModalOpen(false);
            fetchTalepler();
        })
        .catch(err => alert('Red işlemi sırasında bir hata oluştu: ' + (err.response?.data?.message || err.message)));
  };

  const currentTalepler = filteredTalepler.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="xl" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>Tayin Talebi Yönetimi</Typography>
      <Paper>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="talep durumları">
            {STATUS_TABS.map(tab => <Tab label={tab} key={tab} />)}
          </Tabs>
        </Box>
        <Paper sx={{ mt: 2, p: 2 }}>
          <TextField
            fullWidth
            label="Ara (Personel Adı, Sicil, Unvan, Tercih)"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </Paper>
        <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '4%' }}>Sıra No</TableCell>
                    <TableCell>Personel Adı</TableCell>
                    <TableCell>Sicil</TableCell>
                    <TableCell>Unvan</TableCell>
                    <TableCell>Talep Tarihi</TableCell>
                    <TableCell>Tercihler</TableCell>
                    {activeTab !== 0 && <TableCell>Karar Tarihi</TableCell>}
                    {activeTab === 1 && <TableCell>Atanılan Yer</TableCell>}
                    <TableCell align="right">İşlemler</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentTalepler.length > 0 ? (
                    currentTalepler.map((talep, index) => (
                      <TableRow key={talep.id} hover>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{talep.personelAdi}</TableCell>
                        <TableCell>{talep.personelSicil}</TableCell>
                        <TableCell>{talep.unvan}</TableCell>
                        <TableCell>{new Date(talep.talepTarihi).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {Array.isArray(talep.talepEdilenAdliyeler) 
                            ? talep.talepEdilenAdliyeler.map(t => `${t.sira}. ${t.ad}`).join(', ') 
                            : ''}
                        </TableCell>
                        {activeTab !== 0 && <TableCell>{talep.kararTarihi ? new Date(talep.kararTarihi).toLocaleDateString() : '-'}</TableCell>}
                        {activeTab === 1 && <TableCell>{talep.atananAdliye || '-'}</TableCell>}
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Box sx={{ mr: 2 }}>{getStatusChip(talep.durum)}</Box>
                            <Box>
                              <Tooltip title="Detayları Gör"><IconButton onClick={() => openDetayModal(talep)} size="small"><InfoIcon /></IconButton></Tooltip>
                              {activeTab === 0 && (
                                <>
                                  <Tooltip title="Onayla"><IconButton onClick={() => openOnayModal(talep)} color="success" size="small"><CheckCircleIcon /></IconButton></Tooltip>
                                  <Tooltip title="Reddet"><IconButton onClick={() => openRedModal(talep)} color="error" size="small"><CancelIcon /></IconButton></Tooltip>
                                </>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                        <TableCell colSpan={activeTab === 1 ? 8 : 7} align="center">
                            Bu kategoride gösterilecek talep bulunmamaktadır.
                        </TableCell>
                    </TableRow>
                  )}
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
      </Paper>
      <OnayModal 
        open={onayModalOpen} 
        onClose={() => setOnayModalOpen(false)}
        talep={selectedTalep} 
        onConfirm={handleOnayla}
        loading={modalLoading}
        error={modalError}
      />
      <RedModal open={redModalOpen} onClose={() => setRedModalOpen(false)} talep={selectedTalep} onConfirm={handleReddet} />
      <TalepDetayModal open={detayModalOpen} onClose={() => setDetayModalOpen(false)} talep={selectedTalep} />
    </Container>
  );
}

export default YetkiliPage;
