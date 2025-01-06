import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        try {
          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Verify token validity
          await axios.get('http://localhost:8080/api/budget', {
            headers: { 'Authorization': `Bearer ${token}` },
            withCredentials: true
          });
          
          setIsAuthenticated(true);
        } catch (error) {
          if (error.response?.status === 401 || error.response?.status === 403) {
            // Token is invalid or expired
            logout();
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token) => {
    localStorage.setItem('jwtToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
  };

  const checkTokenValidity = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      logout();
      return false;
    }

    try {
      await axios.get('http://localhost:8080/api/budget', {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true
      });
      return true;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
        return false;
      }
      return true; // Other errors might be unrelated to authentication
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      loading, 
      login, 
      logout,
      checkTokenValidity 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 