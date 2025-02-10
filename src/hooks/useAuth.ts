import { useState, useEffect } from 'react'; 
import { useRouter } from 'next/router'; 
import { register, login } from '@/lib/api';
import { User, LoginCredentials, RegisterData } from '@/lib/types';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  

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
      const { user } = await login(credentials); // Use the login function from api.ts
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
    const { user } = await register(data); // Use the register function from api.ts
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




  // Logout function that clears user data from localStorage
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false); // Update authentication state
    router.push('/login'); // Redirect to login page
  };

  return { isAuthenticated, user, login:handleLogin, signup:handleSignup, logout };
};
