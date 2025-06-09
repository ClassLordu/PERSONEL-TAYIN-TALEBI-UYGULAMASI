import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { ColorModeContext } from '../context/ThemeContext';
import Snowfall from './Snowfall';

function MinimalLayout() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <Snowfall />
      <IconButton
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1, // Diğer elemanların üzerinde olmasını sağlar
        }}
        onClick={colorMode.toggleColorMode}
        color="inherit"
      >
        {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
      
      {/* Bu layout'u kullanan sayfa burada görünecek */}
      <Outlet />
    </Box>
  );
}

export default MinimalLayout;
