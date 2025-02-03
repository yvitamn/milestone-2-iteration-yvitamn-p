import { useState, useEffect, ReactNode } from 'react';
import { AuthContext, AuthContextType } from './AuthContext';  // Import the context
import { decodeJwt } from '@/lib/auth/jwt';
import { useRouter } from 'next/router';
import { User, LoginResponse } from '@/lib/types';

// Provider component that wraps the app and provides authentication state
export const AuthenticateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null); // Use the User type from your types.ts
  const router = useRouter();

  // Check for JWT token on page load (useEffect to run on mount)
  useEffect(() => {
    const token = localStorage.getItem('token'); // You could also check cookies if using SSR
    if (token) {
      const decoded = decodeJwt(token);
      if (decoded) {
        setUser({
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          password: '', // Password is not needed after login
        });
        setIsAuthenticated(true);
      }
    }
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data: LoginResponse = await response.json();
      localStorage.setItem('token', data.access_token);
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear token and user state
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login'); // Redirect to login page
  };

  // Define the authContextValue using AuthContextType
  const authContextValue: AuthContextType = {
    isAuthenticated,
    login,
    logout,
    user,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthenticateProvider;