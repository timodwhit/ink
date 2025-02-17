import React, { createContext, useContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';

interface AuthContextType {
  user: {
    id: string;
    email: string;
  } | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null);

  useEffect(() => {
    // Check for stored auth token and validate it
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const authenticatedUser = await userService.validateUser(email, password);
    if (!authenticatedUser) {
      throw new Error('Invalid credentials');
    }
    setUser(authenticatedUser);
    localStorage.setItem('user', JSON.stringify(authenticatedUser));
  };

  const signup = async (email: string, password: string) => {
    const newUser = await userService.createUser({ email, password });
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
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
