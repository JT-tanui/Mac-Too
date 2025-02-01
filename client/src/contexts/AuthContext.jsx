import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isSuperAdmin: false,
    token: null
  });

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAuthState({
      isAuthenticated: false,
      isSuperAdmin: false,
      token: null
    });
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);