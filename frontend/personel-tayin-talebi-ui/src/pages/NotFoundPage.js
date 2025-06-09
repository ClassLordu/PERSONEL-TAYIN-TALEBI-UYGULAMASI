import React from 'react';
import { Box, Button, Container, Typography, Stack } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 200px)', // Ekranı kaplaması için
        textAlign: 'center',
      }}
    >
      <ErrorOutlineIcon color="primary" sx={{ fontSize: 80, mb: 2 }} />
      <Typography variant="h3" component="h1" gutterBottom>
        404: Sayfa Bulunamadı
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Aradığınız sayfa mevcut değil veya bu sayfayı görmeye yetkiniz yok.
      </Typography>
      
      {/* Butonları yan yana koymak için Stack kullanıyoruz */}
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)} // Tarayıcı geçmişinde bir sayfa geri gider
        >
          Geri Dön
        </Button>
        <Button
          variant="contained"
          component={RouterLink}
          to="/"
        >
          Anasayfaya Dön
        </Button>
      </Stack>
    </Box>
  );
}

export default NotFoundPage;
