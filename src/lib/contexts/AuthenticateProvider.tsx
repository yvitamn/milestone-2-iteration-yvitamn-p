import { apiLogin, apiRegister } from '@/lib/api';
import { useState, useEffect, ReactNode } from 'react';
import { AuthContext, AuthContextType } from '@/lib/contexts/AuthContext';  // Import the context
import { User, LoginCredentials, RegisterData } from '@/lib/types';
import useUserData from '@/hooks/useUserData'; 

// Provider component that wraps the app and provides authentication state
export const AuthenticateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  //const [token, setToken] = useState<string | null>(null); 
  const [user, setUser] = useState<User | null>(null);

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
      setIsAuthenticated(false);
    }
  }
}, []);


  // Login function that stores user info in localStorage
    const handleLogin = async (credentials: LoginCredentials) => {
      try {
        const response = await apiLogin(credentials); // Use the login function from api.ts
        if (!response.user) {
          throw new Error('User data is undefined');
        }
        localStorage.setItem('user', JSON.stringify(user as User));
        setUser(response.user);
        setIsAuthenticated(true);
     // Handle the case when user is undefined (optional)
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    };
  
  // Signup function that stores user info in localStorage
  const handleSignup = async (data: RegisterData) => {
    try {
      const { user } = await apiRegister(data); // Use the register function from api.ts
      if (!user) {
        throw new Error('User data is undefined');
      }
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'true');
      setUser(user);
      setIsAuthenticated(true);
      // Handle the case when user is undefined (optional)
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Define the authContextValue using AuthContextType
  const authContextValue: AuthContextType = {
    isAuthenticated, 
    user, 
    login:handleLogin, 
    signup:handleSignup, 
    logout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthenticateProvider;