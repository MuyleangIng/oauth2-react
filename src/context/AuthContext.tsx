// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  username: string;
}

interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  setAuthState: (user: User | null, tokens: AuthTokens | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);

  useEffect(() => {
    // Load auth state from localStorage on mount
    const storedUser = localStorage.getItem('user');
    const storedTokens = localStorage.getItem('tokens');
    if (storedUser && storedTokens) {
      setUser(JSON.parse(storedUser));
      setTokens(JSON.parse(storedTokens));
    }
  }, []);

  const setAuthState = (newUser: User | null, newTokens: AuthTokens | null) => {
    setUser(newUser);
    setTokens(newTokens);
    if (newUser && newTokens) {
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('tokens', JSON.stringify(newTokens));
    }
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('user');
    localStorage.removeItem('tokens');
  };

  return (
    <AuthContext.Provider value={{ user, tokens, setAuthState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;