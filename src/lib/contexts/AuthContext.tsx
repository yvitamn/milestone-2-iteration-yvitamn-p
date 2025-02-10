import { createContext} from 'react'; 
import { LoginCredentials, RegisterData, User } from '@/lib/types';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

// Create AuthContext with default values
export const AuthContext = createContext<AuthContextType | undefined>(undefined);


