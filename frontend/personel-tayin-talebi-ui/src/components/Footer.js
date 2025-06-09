import React from 'react';
import { Box, Typography, Container } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto', // Bu satır, footer'ı sayfa içeriğinin altına iter.
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} T.C. Adalet Bakanlığı Bilgi İşlem Genel Müdürlüğü. Tüm hakları saklıdır.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
