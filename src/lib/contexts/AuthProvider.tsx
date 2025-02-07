import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth'; // assuming your useAuth hook is here
import { LoginCredentials, RegisterData } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
