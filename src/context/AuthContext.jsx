import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activeSession = localStorage.getItem('ambroisie_session');
    if (activeSession) {
      setUser(JSON.parse(activeSession));
    }
    const activeAdmin = localStorage.getItem('ambroisie_admin');
    if (activeAdmin) {
      setAdmin(JSON.parse(activeAdmin));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('ambroisie_users') || '[]');
    const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (matchedUser) {
      const sessionUser = { name: matchedUser.name, email: matchedUser.email };
      localStorage.setItem('ambroisie_session', JSON.stringify(sessionUser));
      setUser(sessionUser);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password.' };
  };

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('ambroisie_users') || '[]');
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (exists) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('ambroisie_users', JSON.stringify(users));

    const sessionUser = { name, email };
    localStorage.setItem('ambroisie_session', JSON.stringify(sessionUser));
    setUser(sessionUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('ambroisie_session');
    setUser(null);
  };

  // Simple admin login (can be extended to multiple admins)
  const loginAdmin = (email, password) => {
    // default admin credentials — replace with secure check in production
    // updated admin credentials requested by user
    const DEFAULT_ADMIN = { email: 'pardhusingampalli29@gmail.com', password: 'pardhu2299', name: 'Administrator' };
    if (email.toLowerCase() === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
      const sessionAdmin = { name: DEFAULT_ADMIN.name, email: DEFAULT_ADMIN.email };
      localStorage.setItem('ambroisie_admin', JSON.stringify(sessionAdmin));
      setAdmin(sessionAdmin);
      return { success: true };
    }

    // also allow admins added to localStorage under ambroisie_admins
    const admins = JSON.parse(localStorage.getItem('ambroisie_admins') || '[]');
    const matched = admins.find(a => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
    if (matched) {
      const sessionAdmin = { name: matched.name || 'Administrator', email: matched.email };
      localStorage.setItem('ambroisie_admin', JSON.stringify(sessionAdmin));
      setAdmin(sessionAdmin);
      return { success: true };
    }

    return { success: false, error: 'Invalid admin credentials.' };
  };

  const logoutAdmin = () => {
    localStorage.removeItem('ambroisie_admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, admin, loginAdmin, logoutAdmin, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
