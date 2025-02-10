import { apiLogin, apiRegister } from '@/lib/api';
import { useState, useEffect, ReactNode } from 'react';
import { AuthContext, AuthContextType } from '@/lib/contexts/AuthContext';  // Import the context
import { User, LoginCredentials, RegisterData } from '@/lib/types';


// Provider component that wraps the app and provides authentication state
export const AuthenticateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

    // Check if the user is authenticated (on page load)
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
        try {
            const parsedUser: User = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error parsing user data:', error);
            // Clear invalid data from localStorage
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        }
        }
    }, []);


  // Login function that stores user info in localStorage
    const handleLogin = async (credentials: LoginCredentials) => {
      try {
        const { user } = await apiLogin(credentials); // Use the login function from api.ts
        if (!user) {
          throw new Error('User data is undefined');
        }
        localStorage.setItem('user', JSON.stringify(user as User));
        setUser(user as User);
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
      localStorage.setItem('user', JSON.stringify(user as User));
      setUser(user as User);
      setIsAuthenticated(true);
      // Handle the case when user is undefined (optional)
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
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