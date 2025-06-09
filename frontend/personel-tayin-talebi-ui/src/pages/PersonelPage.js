import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Paper, Grid, Card, CardActionArea, CardContent
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import HistoryIcon from '@mui/icons-material/History';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CampaignIcon from '@mui/icons-material/Campaign';

// Kısayol kartları için bir bileşen
const ShortcutCard = ({ title, icon, path }) => {
  const navigate = useNavigate();
  return (
    <Grid xs={12} sm={6} md={4}>
      <Card sx={{ height: '100%' }}>
        <CardActionArea
          onClick={() => navigate(path)}
          sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2 }}
        >
          {icon}
          <CardContent>
            <Typography variant="h6" component="div" textAlign="center">
              {title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

function PersonelPage() {
  const { user, hasRole } = useAuth();

  const personelShortcuts = [
    { title: 'Yeni Talep Oluştur', icon: <PostAddIcon color="primary" sx={{ fontSize: 40 }} />, path: '/talep-olustur' },
    { title: 'Taleplerim', icon: <ListAltIcon color="primary" sx={{ fontSize: 40 }} />, path: '/taleplerim' },
    { title: 'Profilim', icon: <AccountBoxIcon color="primary" sx={{ fontSize: 40 }} />, path: '/profilim' },
  ];

  const yetkiliShortcuts = [
    { title: 'Tayin Yönetimi', icon: <FactCheckIcon color="secondary" sx={{ fontSize: 40 }} />, path: '/yetkili/tayin-yonetim' },
    { title: 'Personel Yönetimi', icon: <SupervisorAccountIcon color="secondary" sx={{ fontSize: 40 }} />, path: '/yetkili/personel-yonetimi' },
    { title: 'Tayin Dönemi Yönetimi', icon: <EventNoteIcon color="secondary" sx={{ fontSize: 40 }} />, path: '/yetkili/tayin-donemi-yonetimi' },
    { title: 'Duyuru Yönetimi', icon: <CampaignIcon color="secondary" sx={{ fontSize: 40 }} />, path: '/yetkili/duyuru-yonetimi' },
    { title: 'İşlem Kayıtları', icon: <HistoryIcon color="secondary" sx={{ fontSize: 40 }} />, path: '/admin/islem-kayitlari' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Paper sx={{ p: 3, mb: 4, display: 'flex', alignItems: 'center' }}>
            <PersonIcon color="action" sx={{ fontSize: 60, mr: 2 }} />
            <Box>
              <Typography variant="h4" component="h1">
                Kontrol Paneli
              </Typography>
               {user ? (
                <Typography variant="body1" color="text.secondary">
                  Hoş geldiniz, <strong>{user.ad} {user.soyad}</strong> (Sicil: {user.sicilNumarasi})
                </Typography>
              ) : (
                <Typography variant="body1">Yükleniyor...</Typography>
              )}
            </Box>
        </Paper>

        {/* Kısayol Bölümleri */}
        {user && (
          <>
            {hasRole(user, "Yetkili") && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>Yönetici İşlemleri</Typography>
                <Grid container spacing={3}>
                  {yetkiliShortcuts.map(item => <ShortcutCard key={item.title} {...item} />)}
                </Grid>
              </Box>
            )}

            <Box>
              <Typography variant="h5" gutterBottom>Personel İşlemleri</Typography>
              <Grid container spacing={3}>
                {personelShortcuts.map(item => <ShortcutCard key={item.title} {...item} />)}
              </Grid>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}

export default PersonelPage;
