
import { useContext } from 'react';
import { AuthContext } from '@/lib/contexts/AuthContext';


export const useAuth = () => {
  const authContext = useContext(AuthContext); // Get auth context value
 
  // Fallback in case the AuthContext is not found
  if (!authContext) {
    throw new Error('useAuth must be used within an AuthenticateProvider');
  }

  const { 
    isAuthenticated, 
    userLogin, 
    userData, 
    errorUserData, 
    token, 
    login, 
    logout, 
    signup } = authContext;


  return { 
    isAuthenticated, 
    userLogin, 
    userData, 
    errorUserData, 
    token, 
    login,
    logout,
    signup };
};
