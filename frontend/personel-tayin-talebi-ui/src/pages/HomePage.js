import React from 'react';
import {
  Container, Typography, Button, Box, Card, CardContent,
  Divider, Link, Fade
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import RuleIcon from '@mui/icons-material/Rule';
import CampaignIcon from '@mui/icons-material/Campaign';
import apiService from '../services/apiService';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: <SwapHorizIcon fontSize="large" color="primary" />,
    title: 'Hızlı Talep Oluşturma',
    description: 'Birkaç adımda, gitmek istediğiniz yeri ve gerekçenizi belirterek tayin talebinizi kolayca oluşturun.',
  },
  {
    icon: <RuleIcon fontSize="large" color="primary" />,
    title: 'Talep Durumu Takibi',
    description: 'Oluşturduğunuz taleplerin onay sürecindeki mevcut aşamasını ve sonuçlarını anlık olarak takip edin.',
  },
  {
    icon: <CampaignIcon fontSize="large" color="primary" />,
    title: 'Güncel Duyurular',
    description: 'Genel müdürlük tarafından yayınlanan tayin dönemleri ve önemli bilgilendirmelere tek yerden ulaşın.',
  },
];

function HomePage() {
  const theme = useTheme();
  const { user } = useAuth();
  const [duyurular, setDuyurular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getDuyurular()
      .then(response => {
        // En son 5 duyuruyu alıyoruz
        setDuyurular(response.data.slice(0, 5));
        setLoading(false);
      })
      .catch(error => {
        console.error("Duyurular alınırken hata oluştu:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="lg">
      <Fade in={true} timeout={1000}>
        <Box
          sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Adalet Bakanlığı Logosu */}
          <Box
            component="img"
            src="/images/adalet_bakanligi_logo.png"
            alt="Adalet Bakanlığı Logosu"
            sx={{
              height: 160,
              mb: 4,
              filter: theme.palette.mode === 'dark' 
                ? 'drop-shadow(0 0 7px rgba(255, 255, 255, 0.5))' 
                : 'none'
            }}
          />

          <Typography variant="h2" component="h1" gutterBottom>
            Personel Tayin Talep Sistemine Hoş Geldiniz
          </Typography>

          <Typography variant="h5" color="text.secondary" paragraph sx={{ maxWidth: '750px' }}>
            T.C. Adalet Bakanlığı personeli için geliştirilen bu platformda, yer değiştirme (tayin) taleplerinizi kolayca oluşturabilir, mevcut taleplerinizin durumunu anlık olarak takip edebilir ve güncel duyuruları görüntüleyebilirsiniz.
          </Typography>

          {!user && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to="/giris"
              sx={{ mt: 2, mb: 6, py: 1.5, px: 5, fontSize: '1.1rem' }}
            >
              Giriş Yap ve Başla
            </Button>
          )}

          {user && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to="/panel"
              sx={{ mt: 2, mb: 6, py: 1.5, px: 5, fontSize: '1.1rem' }}
            >
              Kontrol Paneline Git
            </Button>
          )}

          <Divider sx={{ width: '100%', mb: 6 }} />

          {/* Dengesiz görünümü engellemek için Grid yerine Flexbox kullanıldı */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap', // Öğelerin alt satıra kaymasını sağlar
              justifyContent: 'center', // Öğeleri satır içinde ortalar
              gap: 4, // Öğeler arasına boşluk koyar
            }}
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                sx={{
                  // Kartların genişliğini ekran boyutuna göre ayarlar
                  flexGrow: 1, // Kalan boşluğu doldurmaya çalışır
                  flexBasis: { xs: '100%', sm: '40%', md: '30%' }, // Temel genişlik
                  minWidth: 280, // Minimum genişlik
                  maxWidth: { xs: '100%', sm: '45%' }, // Maksimum genişlik
                  // Diğer stiller
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 2,
                }}
              >
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
          
          <Divider sx={{ width: '100%', my: 6 }} />

          {/* Güncel Duyurular Bölümü */}
          <Box sx={{ width: '100%', maxWidth: '800px', textAlign: 'left' }}>
            <Typography variant="h4" component="h2" gutterBottom>
              <CampaignIcon sx={{ verticalAlign: 'middle', mr: 1 }}/>
              Güncel Duyurular
            </Typography>
            {loading ? (
              <Typography>Yükleniyor...</Typography>
            ) : duyurular.length > 0 ? (
              <Box>
                {duyurular.map(duyuru => (
                  <Card key={duyuru.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="h6">{duyuru.baslik}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Yayın Tarihi: {new Date(duyuru.yayinTarihi).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body1">{duyuru.icerik}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Typography>Gösterilecek güncel duyuru bulunmamaktadır.</Typography>
            )}
          </Box>
          
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Sürüm 1.0.0
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {'Geliştirici: '}
              <Link color="inherit" href="https://github.com/ClassLordu" target="_blank" rel="noopener">
                Onur Can ALEMDAROĞLU
              </Link>
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Container>
  );
}

export default HomePage; 