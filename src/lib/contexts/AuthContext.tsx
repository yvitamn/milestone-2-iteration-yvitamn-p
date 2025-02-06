import { createContext} from 'react';
import { User } from '@/lib/types';


// Defining the AuthContextType
export interface AuthContextType {
  isAuthenticated: boolean;
  authToken: string | null; //authToken required
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  user: User | null;
}

// Create AuthContext with default values
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
