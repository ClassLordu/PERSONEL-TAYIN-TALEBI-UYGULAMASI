import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (auth.user) {
      navigate('/panel', { replace: true });
    }
  }, [auth.user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const sicilNumarasi = data.get('sicilNumarasi');
    const password = data.get('password');

    setLoading(true);
    setError('');

    try {
      await auth.login(sicilNumarasi, password);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.';
        setError(errorMessage);
    } finally {
        setLoading(false);
    }
  };

  if (auth.user) {
    return null;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Card sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
        <LockOutlinedIcon color="primary" sx={{ fontSize: 40 }}/>
        <Typography component="h1" variant="h5" sx={{mt: 1}}>
          Sisteme Giriş
        </Typography>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              margin="normal"
              required
              fullWidth
              id="sicilNumarasi"
              label="Sicil Numarası"
              name="sicilNumarasi"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Şifre"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Box sx={{ position: 'relative' }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                Giriş Yap
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: 'primary.main',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default LoginPage; 