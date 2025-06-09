import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import { CssBaseline } from '@mui/material';
import { routesConfig } from '../routes';
import ProtectedRoute from './ProtectedRoute';
import NotFoundPage from '../pages/NotFoundPage';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        {/* Tüm sayfalar için ana Layout */}
        <Route path="/" element={<Layout />}>
          {routesConfig.map((route, index) => {
            const isPublic = !route.roles || route.roles.length === 0;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  isPublic ? (
                    route.element
                  ) : (
                    <ProtectedRoute allowedRoles={route.roles}>
                      {route.element}
                    </ProtectedRoute>
                  )
                }
              />
            );
          })}
          {/* Tanımlı rotaların hiçbiri eşleşmezse bu rota devreye girer */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
