import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Container, Typography, Box, Paper, Grid, Avatar, CircularProgress, Alert,
  List, ListItem, ListItemText, Divider, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Snackbar, ListItemIcon
} from '@mui/material';
import { AccountCircle, BusinessCenter, Place, Star, Edit } from '@mui/icons-material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import apiService from '../services/apiService';

function ProfilimPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (user) {
      apiService.getMyProfile()
        .then(response => {
          setProfile(response.data);
          setLoading(false);
        })
        .catch(err => {
          setError('Profil bilgileri yüklenirken bir hata oluştu.');
          setLoading(false);
        });
    }
  }, [user]);

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Yeni şifreler uyuşmuyor.');
      return;
    }
    setPasswordError('');
    
    apiService.changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    })
    .then(() => {
        setSnackbar({ open: true, message: 'Şifre başarıyla güncellendi.', severity: 'success' });
        handleClosePasswordDialog();
    })
    .catch(err => {
        const errorMessage = err.response?.data?.message || 'Şifre güncellenirken bir hata oluştu.';
        setPasswordError(errorMessage);
        setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    });
  };

  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
  };

  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!profile) return <Alert severity="info">Profil bilgileri bulunamadı.</Alert>;

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Avatar sx={{ width: 120, height: 120, mb: 2, bgcolor: 'primary.main' }}>
                <AccountCircle sx={{ fontSize: 90 }} />
              </Avatar>
              <Typography variant="h4" component="h1" gutterBottom>
                {profile.ad} {profile.soyad}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sicil: {profile.sicilNumarasi}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {profile.roller.join(', ')}
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<Edit />} 
                onClick={handleOpenPasswordDialog} 
                sx={{ mt: 2 }}
              >
                Şifre Değiştir
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Profil Detayları
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                <ListItem>
                  <ListItemIcon>
                    <BusinessCenter color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Unvan" secondary={profile.unvan || 'N/A'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Place color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Mevcut Görev Yeri" secondary={profile.mevcutAdliye || 'N/A'} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Star color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Hizmet Puanı" secondary={profile.hizmetPuani || 0} />
                </ListItem>
              </List>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Çalışma Geçmişi
              </Typography>
              <Divider sx={{ mb: 2 }}/>
              {profile.calismaGecmisi && profile.calismaGecmisi.length > 0 ? (
                <Timeline position="right" sx={{ p: 0, m: 0 }}>
                  {profile.calismaGecmisi.map((gorev, index) => (
                    <TimelineItem key={index} sx={{ '::before': { content: 'none' } }}>
                      <TimelineSeparator>
                        <TimelineDot variant="outlined" color="primary" />
                        {index < profile.calismaGecmisi.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Typography variant="subtitle1" component="div" fontWeight="bold">
                          {gorev.adliyeAdi}
                        </Typography>
                        <Typography variant="body1" sx={{mb: 0.5}}>{gorev.unvanAdi}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(gorev.baslamaTarihi).toLocaleDateString()} - {gorev.ayrilmaTarihi ? new Date(gorev.ayrilmaTarihi).toLocaleDateString() : 'Devam ediyor'}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              ) : (
                <Typography>Çalışma geçmişi bulunmamaktadır.</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Şifre Değiştirme Dialogu */}
      <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog}>
        <DialogTitle>Şifre Değiştir</DialogTitle>
        <DialogContent>
          {passwordError && <Alert severity="error" sx={{ mb: 2 }}>{passwordError}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            name="currentPassword"
            label="Mevcut Şifre"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.currentPassword}
            onChange={handlePasswordInputChange}
          />
          <TextField
            margin="dense"
            name="newPassword"
            label="Yeni Şifre"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.newPassword}
            onChange={handlePasswordInputChange}
          />
          <TextField
            margin="dense"
            name="confirmPassword"
            label="Yeni Şifre (Tekrar)"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordData.confirmPassword}
            onChange={handlePasswordInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog}>İptal</Button>
          <Button onClick={handlePasswordChange} variant="contained">Kaydet</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ProfilimPage;
