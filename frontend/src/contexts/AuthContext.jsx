import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in when app loads
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('AuthContext: Checking stored auth data', { 
      tokenExists: !!token, 
      userDataExists: !!userData 
    });
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('AuthContext: Setting user from localStorage', parsedUser);
        setUser(parsedUser);
        
        // Verify token is still valid by making a request
        api.get('/v1/auth/me')
          .then(response => {
            console.log('AuthContext: Token verified, user is valid');
            setUser(response.data);
          })
          .catch(error => {
            console.error('AuthContext: Token verification failed', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          });
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    console.log('AuthContext: Login called with', { userData, token: !!token });
    
    // Store in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update state
    setUser(userData);
    
    console.log('AuthContext: User logged in successfully', userData);
  };

  const logout = () => {
    console.log('AuthContext: Logout called');
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear state
    setUser(null);
    
    console.log('AuthContext: User logged out');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  console.log('AuthContext: Current state', { 
    user: user ? `${user.firstName} ${user.lastName}` : null, 
    loading, 
    isAuthenticated: !!user 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

