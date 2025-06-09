import React from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Divider, IconButton, Typography
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@mui/icons-material/Close';

const drawerWidth = 260; // Menü genişliği

function Sidebar({ mobileOpen, handleDrawerToggle, menuItems, onLogout }) {
  
  const drawerContent = (
    <div>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        p: 2, 
        minHeight: 64,
        backgroundColor: (theme) => theme.palette.mode === 'light' 
          ? theme.palette.primary.main 
          : theme.palette.background.paper
      }}>
        <Typography 
          variant="h6" 
          color={(theme) => theme.palette.mode === 'light' ? 'white' : 'inherit'}
        >
          Menü
        </Typography>
        <IconButton 
          onClick={handleDrawerToggle} 
          edge="end" 
          aria-label="close menu"
          sx={{
            color: (theme) => theme.palette.mode === 'light' ? 'white' : 'inherit',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={handleDrawerToggle}
              // Aktif linkin arkaplanını renklendiren stil
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
              })}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              {/* Başlıktaki " - ... Sistemi" kısmını temizleyerek sadece sayfa adını gösteriyoruz */}
              <ListItemText primary={item.title.split(' - ')[0]} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ mt: 'auto' }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={onLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Çıkış Yap" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { xs: drawerWidth }, flexShrink: { xs: 0 } }}
    >
      {/* Mobil için Geçici Menü */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ 
          keepMounted: true,
        }}
        sx={{
          zIndex: 1300, // Higher than AppBar's default (1100)
          '& .MuiBackdrop-root': {
            zIndex: 1300
          },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            zIndex: 1400
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
