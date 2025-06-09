import React, { useState, useMemo, createContext, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Tema değiştirme fonksiyonunu paylaşmak için context oluştur
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

// Tema paletini mod'a göre döndüren fonksiyon
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    // Adalet Bakanlığı kurumsal kimliğine uygun 'bordo' rengini ana renk olarak belirliyoruz.
    primary: {
      main: '#A91D3A', 
    },
    // İkincil renk olarak daha yumuşak bir ton seçiyoruz.
    secondary: {
      main: '#4A4A4A',
    },
    ...(mode === 'light'
      ? {
          // Açık mod için ayarlar
          background: {
            default: '#f5f5f5', // Hafif gri bir arkaplan
            paper: '#ffffff', // Kartlar ve pencereler için beyaz
          },
          text: {
            primary: '#333333',
            secondary: '#555555',
          }
        }
      : {
          // Koyu mod için ayarlar
          background: {
            default: '#121212', // Standart koyu arkaplan
            paper: '#1e1e1e', // Kartlar için biraz daha açık bir ton
          },
          text: {
            primary: '#ffffff',
            secondary: '#bbbbbb',
          },
        }),
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});


// Tüm uygulamayı saracak olan ve tema durumunu yöneten bileşen
export const CustomThemeProvider = ({ children }) => {
  // State'i başlatırken localStorage'ı kontrol et
  const [mode, setMode] = useState(() => {
    try {
      const savedMode = window.localStorage.getItem('themeMode');
      // Kayıtlı değer varsa onu kullan, yoksa 'light' kullan
      return savedMode ? savedMode : 'light';
    } catch (error) {
      // localStorage erişilemezse (örn. gizli mod), 'light' kullan
      console.error("localStorage'a erişilemiyor. Varsayılan tema kullanılıyor.", error);
      return 'light';
    }
  });

  // 'mode' state'i her değiştiğinde bu effect çalışır ve localStorage'ı günceller
  useEffect(() => {
    try {
      window.localStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error("localStorage'a tema kaydedilemedi.", error);
    }
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  // Tema, mod her değiştiğinde yeniden hesaplanır.
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
