import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const token = localStorage.getItem('adminToken');
    return {
      isAuthenticated: !!token,
      isSuperAdmin: localStorage.getItem('isSuperAdmin') === 'true',
      token
    };
  });

  const login = (token, isSuperAdmin) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('isSuperAdmin', String(isSuperAdmin));
    setAuthState({
      isAuthenticated: true,
      isSuperAdmin,
      token
    });
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isSuperAdmin');
    setAuthState({
      isAuthenticated: false,
      isSuperAdmin: false,
      token: null
    });
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);