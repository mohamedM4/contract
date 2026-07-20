import React, { createContext, useContext, useState } from 'react';

// 1. Create the context out here at the top level so everyone can see it
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 👤 Changed the state variable name to 'user' since it holds the entire profile object
  const [user, setUser] = useState(null);

  // 🔑 Triggered inside your Login component upon successful login
  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData); // e.g., userData might be { id: '42', email: 'user@example.com' }
  };

  // 🚪 Clear state and clean up authentication
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null); 
  };

  return (
    // 2. Pass down 'user' in your provider value
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. This hook is now perfectly safe to call from other files!
export const useAuth = () => useContext(AuthContext);