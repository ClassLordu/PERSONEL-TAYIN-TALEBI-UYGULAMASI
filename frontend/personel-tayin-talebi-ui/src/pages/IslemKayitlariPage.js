import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, CircularProgress, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tooltip, TextField, Grid, FormControl, InputLabel, Select, MenuItem, TablePagination, Autocomplete
} from '@mui/material';
import { format } from 'date-fns';
import apiService from '../services/apiService';

function IslemKayitlariPage() {
  const [kayitlar, setKayitlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [eylemTipiFilter, setEylemTipiFilter] = useState('');
  const [eylemTipleri, setEylemTipleri] = useState([]);

  useEffect(() => {
    apiService.getEylemTipleri()
        .then(res => setEylemTipleri(res.data))
        .catch(err => console.error("Eylem tipleri yüklenemedi:", err));
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearchTerm, eylemTipiFilter]);


  const fetchKayitlar = (currentPage, currentRowsPerPage, currentSearchTerm, currentEylemFilter) => {
    setLoading(true);
    apiService.getIslemKayitlari(currentPage + 1, currentRowsPerPage, currentSearchTerm, currentEylemFilter)
      .then(response => {
        const { data, totalRecords: apiTotalRecords } = response.data;
        setKayitlar(data || []);
        setTotalRecords(apiTotalRecords || 0);
      })
      .catch(err => {
        setError('İşlem kayıtları yüklenirken bir hata oluştu.');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchKayitlar(page, rowsPerPage, debouncedSearchTerm, eylemTipiFilter);
  }, [page, rowsPerPage, debouncedSearchTerm, eylemTipiFilter]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading && page === 0 && searchTerm.length === 0) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;

  return (
    <Container maxWidth="xl" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Sistem İşlem Kayıtları
      </Typography>
        <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Kayıtlarda Ara (Personel, İşlem Tipi, Açıklama, IP Adresi)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Grid>
                <Grid item xs="auto">
                    <Autocomplete
                        options={eylemTipleri}
                        getOptionLabel={(option) => option || ''}
                        value={eylemTipiFilter || null}
                        onChange={(event, newValue) => {
                            setEylemTipiFilter(newValue || '');
                            setPage(0);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="İşlem Tipine Göre Filtrele"
                                variant="outlined"
                                sx={{ minWidth: 240 }}
                            />
                        )}
                    />
                </Grid>
            </Grid>
        </Paper>
      {kayitlar.length === 0 && !loading ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Görüntülenecek işlem kaydı bulunmamaktadır.</Typography>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="işlem kayıtları tablosu">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '5%' }}>Sıra No</TableCell>
                  <TableCell>Tarih ve Saat</TableCell>
                  <TableCell>Personel</TableCell>
                  <TableCell>İşlem Tipi</TableCell>
                  <TableCell>Açıklama</TableCell>
                  <TableCell>IP Adresi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {kayitlar.map((kayit, index) => (
                  <TableRow key={kayit.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      {format(new Date(kayit.tarih), 'dd.MM.yyyy HH:mm:ss')}
                    </TableCell>
                    <TableCell>{kayit.personelAdi}</TableCell>
                    <TableCell>{kayit.islemTipi}</TableCell>
                    <Tooltip title={kayit.aciklama} placement="top-start">
                        <TableCell sx={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {kayit.aciklama}
                        </TableCell>
                    </Tooltip>
                    <TableCell>{kayit.ipAdresi}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[15, 25, 50, 100]}
                component="div"
                count={totalRecords}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                labelRowsPerPage="Sayfa başına kayıt:"
            />
          </TableContainer>
        </>
      )}
    </Container>
  );
}

export default IslemKayitlariPage;
