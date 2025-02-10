
import { useContext } from 'react';
import { AuthContext } from '@/lib/contexts/AuthContext';
//import { LoginCredentials, RegisterData } from '@/lib/types';


export const useAuth = () => {
  const authContext = useContext(AuthContext); // Get auth context value
 

  // Fallback in case the AuthContext is not found
  if (!authContext) {
    throw new Error('useAuth must be used within an AuthenticateProvider');
  }

  const { isAuthenticated, user, login, logout } = authContext;

  // const handleLogin = (credentials: LoginCredentials) => {
  //   return login(credentials);
  // };

  // const handleLogout = () => {
  //   return logout();
  // };

  return { isAuthenticated, user, login, logout };
};
