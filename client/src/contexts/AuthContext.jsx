import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isSuperAdmin: false,
    token: null
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Verify token and set state
      const verifyToken = async () => {
        try {
          const response = await fetch('/.netlify/functions/api/admin/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setAuthState({
              isAuthenticated: true,
              isSuperAdmin: data.isSuperAdmin,
              token
            });
          } else {
            localStorage.removeItem('adminToken');
          }
        } catch (error) {
          localStorage.removeItem('adminToken');
        }
      };
      verifyToken();
    }
  }, []);

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