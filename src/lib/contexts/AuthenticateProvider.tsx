'use client';
import { apiLogin, apiRegister } from '@/lib/api';
import { useState, useEffect, ReactNode } from 'react';
import { AuthContext, AuthContextType } from '@/lib/contexts/AuthContext';  // Import the context
import { User, AuthResponse, LoginCredentials, RegisterData } from '@/lib/types';
import { useUserData } from '@/hooks/useUserData'; 


// Provider component that wraps the app and provides authentication state
export const AuthenticateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null); 
  const [userLogin, setUserLogin] = useState<User | null>(null); 
  const [errorUser, setErrorUser] = useState<string | null>(null);
  
  // Using useUserData hook to fetch user data based on token
const { userFetched, errorUserData } = useUserData(isAuthenticated);


    useEffect(() => {
    if (userFetched) {
      // If userFetched is available, you can set it as authenticated user data
      setUserLogin({
        id: userFetched.id,
        email: userFetched.email,
        name: userFetched.name,
      });
      setIsAuthenticated(true);
    }
  }, [userFetched]);


// Effect to check localStorage for existing token and user on initial load
useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true); // User is authenticated if token exists
    }
  }, []);



const handleLogin = async ({ email, password }: LoginCredentials) => {
    try {
      const authResponse: AuthResponse = await apiLogin({ email, password });

      if (!authResponse.access_token) {
        throw new Error('Access token is missing');
      }

      const user: User = {
        id: authResponse.id,
        name: authResponse.name,
        email: authResponse.email,
      };

      localStorage.setItem('token', authResponse.access_token);
      localStorage.setItem('user', JSON.stringify(user));

      setUserLogin(user); // Set the user login state
      setToken(authResponse.access_token);
      setIsAuthenticated(true);
    } catch (error) {
      setErrorUser(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleSignup = async (data: RegisterData) => {
    try {
      const authResponse: AuthResponse = await apiRegister(data);

      if (!authResponse.access_token) {
        throw new Error('Access token is missing');
      }

      const user: User = {
        id: authResponse.id,
        name: authResponse.name,
        email: authResponse.email,
      };

      localStorage.setItem('token', authResponse.access_token);
      localStorage.setItem('user', JSON.stringify(user));

      setUserLogin(user); // Set the user login state
      setToken(authResponse.access_token);
      setIsAuthenticated(true);
    } catch (error) {
      setErrorUser(error instanceof Error ? error.message : 'Signup failed');
    }
  };

  const logout = () => {
   
    setIsAuthenticated(false);
    setUserLogin(null);
    setToken(null);
  };

  // Define the authContextValue using AuthContextType
  const authContextValue: AuthContextType = {
    userData: userFetched, // the fetched user data from the custom hook
    isAuthenticated, 
    userLogin, 
    token,
    login:handleLogin, 
    signup:handleSignup, 
    logout,
    errorUserData,
    
  };

  return (
    <AuthContext.Provider value={authContextValue}>
       {errorUser && <div className="error-message">{errorUser}</div>}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthenticateProvider;