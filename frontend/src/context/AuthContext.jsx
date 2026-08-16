import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';
import { mockUser } from '../mock/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('contentiq_user');
    return savedUser ? JSON.parse(savedUser) : mockUser;
  });
  const [token, setToken] = useState(() => localStorage.getItem('contentiq_token') || 'demo_token_123');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('contentiq_token', token);
    } else {
      localStorage.removeItem('contentiq_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('contentiq_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('contentiq_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      const authToken = data.access_token || 'jwt_token_' + Date.now();
      const currentUser = data.user || {
        id: 'usr_' + Date.now(),
        email,
        name: email.split('@')[0],
        role: 'Content Strategist',
      };
      setToken(authToken);
      setUser(currentUser);
      return { success: true, user: currentUser };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || err.message || 'Login failed. Please check credentials.',
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await registerUser({ name, email, password });
      const authToken = data.access_token || 'jwt_token_' + Date.now();
      const currentUser = data.user || {
        id: 'usr_' + Date.now(),
        email,
        name,
        role: 'Content Strategist',
      };
      setToken(authToken);
      setUser(currentUser);
      return { success: true, user: currentUser };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || err.message || 'Registration failed.',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('contentiq_token');
    localStorage.removeItem('contentiq_user');
  };

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
