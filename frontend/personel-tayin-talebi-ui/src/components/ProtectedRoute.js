import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/giris" state={{ from: location }} replace />;
  }

  const isAllowed = user.roller && allowedRoles.some(role => user.roller.map(r => r.toLowerCase()).includes(role.toLowerCase()));

  if (!isAllowed) {
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default ProtectedRoute;
