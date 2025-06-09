import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import { CustomThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext'; // AuthProvider'ı import et

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CustomThemeProvider>
      <AuthProvider> {/* Uygulamayı AuthProvider ile sar */}
        <App />
      </AuthProvider>
    </CustomThemeProvider>
  </React.StrictMode>
);

reportWebVitals();