import { useState } from 'react';
import { useRouter } from 'next/router';
import { LoginCredentials } from '@/lib/types';

const BASE_URL = "https://api.escuelajs.co/api/v1";
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

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
      localStorage.setItem('token', data.access_token);
      setIsAuthenticated(true); // Update authentication state
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false); // Update authentication state
    router.push('/login'); // Redirect to login page
  };

  return { isAuthenticated, login, logout };
};