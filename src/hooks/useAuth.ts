import { useState, useEffect } from 'react'; 
import { useRouter } from 'next/router'; 
import { User, LoginCredentials, RegisterData } from '@/lib/types';

const BASE_URL = "https://api.escuelajs.co/api/v1";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Check if the user is authenticated (on page load)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Login function that stores user info in localStorage
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true); // Update authentication state
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

// Signup function that stores user info in localStorage
const signup = async (data: RegisterData) => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Signup failed');
    }

    const userData = await response.json();
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true); // Update authentication state
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

  return { isAuthenticated, user, login, signup, logout };
};
