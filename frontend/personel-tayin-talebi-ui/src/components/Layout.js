import React, { useState, useContext, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Box, Button, Container, Avatar, Menu, MenuItem, ListItemIcon, Divider } from '@mui/material';
import { Brightness4, Brightness7, Person as PersonIcon, Logout as LogoutIcon, AccountCircle as AccountCircleIcon, Menu as MenuIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '../context/ThemeContext';
import { routesConfig } from '../routes';
import { useAuth } from '../context/AuthContext';
import Snowfall from './Snowfall';
import Footer from './Footer';
import Sidebar from './Sidebar';

function Layout() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const location = useLocation();
  const auth = useAuth();
  const navigate = useNavigate();

  const [pageTitle, setPageTitle] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Custom menu items that include all yetkili routes for admin users
  const allMenuItems = [...routesConfig];

  // Filter routes based on user's role and inMenu flag
  const menuItems = allMenuItems.filter(route => {
    // First check if route should be in menu at all
    if (!route.inMenu) return false;
    
    // Routes with no role restrictions are visible to everyone
    if (route.roles.length === 0) return true;
    
    // Check if user is authenticated
    if (!auth.user) return false;
    
    // Only show yetkili routes to users with Yetkili role
    if (route.path.includes('/yetkili/') || route.path.includes('/admin/')) {
      return auth.hasRole(auth.user, "Yetkili");
    }
    
    // Regular routes accessible to all authenticated users
    return true;
  });

  useEffect(() => {
    const currentRoute = routesConfig.find(route => route.path === location.pathname);
    const title = currentRoute ? currentRoute.title : 'Personel Tayin Talep Sistemi';
    
    document.title = title;
    setPageTitle(title);
  }, [location]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    auth.logout();
    handleMenuClose();
    navigate('/');
  };
  
  const handleProfile = () => {
    navigate('/profilim');
    handleMenuClose();
  }

  const isHomePage = location.pathname === '/';

  // Function to get initials from name
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Snowfall />
      {!isHomePage && (
        <>
          <AppBar 
            position="fixed" 
            elevation={2}
            sx={{ 
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              zIndex: (theme) => theme.zIndex.drawer + 1 
            }}
          >
            <Container maxWidth="xl">
              <Toolbar disableGutters>
                {auth.user && (
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
                
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ flexGrow: 1, fontWeight: 'bold' }}
                >
                  {pageTitle}
                </Typography>

                {auth.user && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      onClick={handleMenuOpen}
                      color="inherit"
                    >
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                        {getInitials(`${auth.user.ad} ${auth.user.soyad}`)}
                      </Avatar>
                    </IconButton>
                    <Typography sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
                        {auth.user.ad} {auth.user.soyad}
                    </Typography>

                    <Menu
                      anchorEl={anchorEl}
                      open={isMenuOpen}
                      onClose={handleMenuClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      {/* Navigation menu items - filter out "Profilim" to avoid duplication */}
                      {menuItems
                        .filter(item => !item.path.includes('/profilim')) // Exclude the Profilim item
                        .map((item) => (
                          <MenuItem 
                            key={item.title}
                            onClick={() => {
                              navigate(item.path);
                              handleMenuClose();
                            }}
                          >
                            <ListItemIcon>
                              {item.icon}
                            </ListItemIcon>
                            {item.title.split(' - ')[0]}
                          </MenuItem>
                        ))}

                      {/* Divider between navigation and account items */}
                      {menuItems.filter(item => !item.path.includes('/profilim')).length > 0 && <Divider />}

                      {/* Account-related items */}
                      <MenuItem onClick={handleProfile}>
                        <ListItemIcon>
                          <AccountCircleIcon fontSize="small" />
                        </ListItemIcon>
                        Profilim
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                          <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        Çıkış Yap
                      </MenuItem>
                    </Menu>
                  </Box>
                )}

                {!auth.user && !isHomePage && (
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/giris"
                    sx={{ mr: 2 }}
                  >
                    Giriş Yap
                  </Button>
                )}

                <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                  {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Toolbar>
            </Container>
          </AppBar>
          
          {auth.user && <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} menuItems={menuItems} onLogout={handleLogout} />}
        </>
      )}
      
      {isHomePage && (
        <IconButton
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          onClick={colorMode.toggleColorMode}
          color="inherit"
        >
          {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      )}
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: '100%', 
          marginTop: isHomePage ? 0 : '64px'
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}

export default Layout;
