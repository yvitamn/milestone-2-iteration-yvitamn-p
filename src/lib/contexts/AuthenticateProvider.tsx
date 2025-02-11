import { apiLogin, apiRegister, ApiError} from '@/lib/api';
import { useState, useEffect, ReactNode } from 'react';
import { AuthContext, AuthContextType } from '@/lib/contexts/AuthContext';  // Import the context
import { User, AuthResponse, LoginCredentials, RegisterData } from '@/lib/types';
import useUserData from '@/hooks/useUserData'; 

// Provider component that wraps the app and provides authentication state
export const AuthenticateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null); 
  const [user, setUser] = useState<User | null>(null);
  //setUser(response.user);

// Using useUserData hook to fetch user data based on token
const { user: fetchedUser, loading, error } = useUserData(isAuthenticated);

useEffect(() => {
  // If useUserData hook successfully fetched the user, update the state
  if (fetchedUser) {
    setUser(fetchedUser);
    setIsAuthenticated(true);
  }
}, [fetchedUser]);

// Check if the user is authenticated (on page load)
useEffect(() => {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token'); // Fetch the token

  if (storedUser && storedToken) {
    try {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    }
  }
}, []);


const handleLogin = async ({ email, password }: LoginCredentials) => {
    try {
      const authResponse: AuthResponse = await apiLogin({ email, password });

      // Check for required fields in the response
      if (!authResponse.access_token) {
        throw new Error('Access token is missing in the response');
      }

      const user: User = {
        id: authResponse.id || 0, // Default value if id is missing
        name: authResponse.name,
        email: authResponse.email || '',
      };

      localStorage.setItem('token', authResponse.access_token);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);
      setToken(authResponse.access_token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      // Handle API-specific error responses
      if (error instanceof ApiError) {
        console.error(`API Error: ${error.message} (Code: ${error.code})`);
      }
      throw new Error('Login failed');
    }
  };

  // Handle signup function
  const handleSignup = async (data: RegisterData) => {
    try {
      const authResponse: AuthResponse = await apiRegister(data);

      // Check for required fields in the response
      if (!authResponse.access_token) {
        throw new Error('Access token is missing in the response');
      }

      const user: User = {
        id: authResponse.id || 0,
        name: authResponse.name,
        email: authResponse.email || '',
      };

      localStorage.setItem('token', authResponse.access_token);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);
      setToken(authResponse.access_token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Signup failed:', error);
      // Handle API-specific error responses
      if (error instanceof ApiError) {
        console.error(`API Error: ${error.message} (Code: ${error.code})`);
      }
      throw error;
    }
  };


  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  // Define the authContextValue using AuthContextType
  const authContextValue: AuthContextType = {
    isAuthenticated, 
    user, 
    token,
    login:handleLogin, 
    signup:handleSignup, 
    logout,
    //error
    
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthenticateProvider;