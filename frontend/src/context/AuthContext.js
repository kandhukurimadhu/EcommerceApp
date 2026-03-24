import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

/**
 * AuthProvider wraps the entire app and provides authentication state
 * and helper functions to all child components via context.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Current user object
  const [token, setToken] = useState(null);     // JWT token
  const [loading, setLoading] = useState(true); // Initial auth check

  // On mount, restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser  = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  /**
   * Login with username/password → JWT flow
   */
  const login = useCallback(async (username, password) => {
    const res = await api.post('/api/auth/login', { username, password });
    const data = res.data;
    persistSession(data);
    return data;
  }, []);

  /**
   * Register a new account
   */
  const register = useCallback(async (formData) => {
    const res = await api.post('/api/auth/register', formData);
    return res.data;
  }, []);

  /**
   * Save token + user to state and localStorage
   */
  const persistSession = (data) => {
    const { token, ...userInfo } = data;
    setToken(token);
    setUser(userInfo);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userInfo));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  /**
   * Called after OAuth2/Google SSO redirect with token in URL
   */
  const loginWithToken = useCallback(async (jwtToken) => {
    localStorage.setItem('token', jwtToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    // Fetch profile to get user details
    const res = await api.get('/api/profile');
    const userInfo = {
      username: res.data.username,
      email: res.data.email,
      role: res.data.role,
      firstName: res.data.firstName,
      lastName: res.data.lastName,
      profilePicture: res.data.profilePicture,
    };
    setToken(jwtToken);
    setUser(userInfo);
    localStorage.setItem('user', JSON.stringify(userInfo));
  }, []);

  /**
   * Update user state (e.g., after profile edit)
   */
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  /**
   * Logout: clear all session data
   */
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  }, []);

  const isAdmin = user?.role === 'ROLE_ADMIN';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      loginWithToken,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
