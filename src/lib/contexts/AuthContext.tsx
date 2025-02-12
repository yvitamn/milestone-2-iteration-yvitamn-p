'use client';

import { createContext} from 'react'; 
import { LoginCredentials, RegisterData, User } from '@/lib/types';
import { AuthResponseWithPurchase } from '@/lib/types';


export interface AuthContextType {
  isAuthenticated: boolean;
  userLogin: User | null;
  userData : AuthResponseWithPurchase | null;
  token: string | null;
  // tokenType: string | null;
  // expiresIn: number | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: RegisterData) => Promise<void>;
  logout: () => void;
  errorUserData: string | null;
}


// Create AuthContext with default values
export const AuthContext = createContext<AuthContextType | null> (null);



