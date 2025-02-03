import { createContext} from 'react';

// Defining the AuthContextType
export interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  user: { email: string; name: string } | null;
}

// Create AuthContext with default values
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
