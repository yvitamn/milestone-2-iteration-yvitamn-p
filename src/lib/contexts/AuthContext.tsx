import { createContext} from 'react'; 
import { LoginCredentials, RegisterData, User } from '@/lib/types';
//import { AuthResponse } from '@/lib/types';



// Create AuthContext with default values
export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  // tokenType: string | null;
  // expiresIn: number | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: RegisterData) => Promise<void>;
  logout: () => void;
}


