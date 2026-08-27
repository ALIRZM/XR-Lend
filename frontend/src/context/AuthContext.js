import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Kept in localStorage so a page refresh does not log you out
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('xrlend-user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData) => {
    localStorage.setItem('xrlend-user', JSON.stringify(userData));
    setUser(userData);
  };

  // R6 and R8: log out clears the token, so protected pages send you back to login
  const logout = () => {
    localStorage.removeItem('xrlend-user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
