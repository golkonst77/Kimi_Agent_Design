/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_KEY = 'admin_auth';
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'design2024';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const auth = localStorage.getItem(AUTH_KEY);
    if (!auth) return false;
    try {
      const { timestamp } = JSON.parse(auth);
      // Session valid for 24 hours
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        return true;
      }
      localStorage.removeItem(AUTH_KEY);
      return false;
    } catch {
      localStorage.removeItem(AUTH_KEY);
      return false;
    }
  });

  const login = (username: string, password: string): boolean => {
    if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, JSON.stringify({ timestamp: Date.now() }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
