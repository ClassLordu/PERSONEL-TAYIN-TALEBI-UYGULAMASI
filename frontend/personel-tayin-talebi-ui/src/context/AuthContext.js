import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiService from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchAndSetUser = async () => {
    try {
      const storedToken = JSON.parse(localStorage.getItem('user'))?.token;
      if (!storedToken) {
          setUser(null);
          return;
      }
      
      const decodedToken = jwtDecode(storedToken);
      if (decodedToken.exp * 1000 < Date.now()) {
          // Token expired
          localStorage.removeItem('user');
          setUser(null);
          return;
      }

      // Token is valid, fetch user profile
      const profileResponse = await apiService.getMyProfile();
      const userData = { ...profileResponse.data, token: storedToken };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData)); // Update storage with full user data
    } catch (error) {
      console.error("Failed to fetch user or token invalid", error);
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  useEffect(() => {
    fetchAndSetUser();
  }, []);
  
  const login = async (sicilNumarasi, password) => {
    const response = await apiService.login(sicilNumarasi, password);
    const token = response.data.token;
    
    // Store only token temporarily
    localStorage.setItem('user', JSON.stringify({ token }));
    
    // Fetch full profile and update state and storage
    await fetchAndSetUser(); 
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };
  
  const refreshAuthUser = async () => {
    console.log("Refreshing user data..."); // For debugging
    await fetchAndSetUser();
  };

  const hasRole = (user, roleName) => {
    if (!user) return false;

    // Check different possible formats for roles in the user object
    if (user.Roller && Array.isArray(user.Roller)) {
      return user.Roller.includes(roleName);
    }
    
    if (user.roller && Array.isArray(user.roller)) {
      return user.roller.includes(roleName);
    }
    
    if (typeof user.rol === 'string') {
      return user.rol === roleName;
    }
    
    if (typeof user.role === 'string') {
      return user.role === roleName;
    }
    
    return false;
  };

  // Değerleri provider'a ver.
  // Not: `loading` durumu, uygulama ilk açıldığında
  // kimlik kontrolü bitene kadar bir yükleme ekranı göstermek için kullanılabilir.
  const value = {
    user,
    login,
    logout,
    refreshAuthUser,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Kendi hook'umuzu oluşturarak context'i kullanmayı kolaylaştırıyoruz
export const useAuth = () => {
  return useContext(AuthContext);
};
