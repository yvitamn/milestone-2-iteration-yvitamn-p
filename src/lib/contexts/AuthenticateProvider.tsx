import { useState, useEffect, ReactNode } from 'react';
import { AuthContext, AuthContextType } from '@/lib/contexts/AuthContext';  // Import the context
import { decodeJwt } from '@/lib/auth/jwt';
import { useRouter } from 'next/router';
import { User, LoginResponse } from '@/lib/types';

const BASE_URL = "https://api.escuelajs.co/api/v1";

// export interface AuthContextType {
//   isAuthenticated: false;
//   authToken: ""; //authToken required
//   login: (credentials: { email: string; password: string }) => Promise<void>;
//   logout: () => void;
//   user: User | null;
// }

// // Create AuthContext with default values
// export const AuthContext = createContext<AuthContextType | undefined>(undefined);


// Provider component that wraps the app and provides authentication state
export const AuthenticateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null); // Use the User type from your types.ts
  const [authToken, setAuthToken] = useState<string | null>(null);
  const router = useRouter();

  // Check for JWT token on page load (useEffect to run on mount)
  useEffect(() => {
    const token = localStorage.getItem('token'); // You could also check cookies if using SSR
    if (token) {
      const decoded = decodeJwt(token);
      if (decoded) {
        // Set user details from decoded JWT payload
        setUser({
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          password: '', // Password is not needed after login
        });
        setIsAuthenticated(true);
        setAuthToken(token);  // Store the token in the state
      }
      }  
  }, []); // This effect runs only once when the component is mounted

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
      if (!response.ok) {
        throw new Error('Login failed');
      }
      // Store the token and user data
      localStorage.setItem('token', data.access_token);
      setAuthToken(data.access_token);  // Update the token state
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
    setAuthToken(null);  // Clear token from state
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login'); // Redirect to login page

  };

  //Define the authContextValue using AuthContextType
  const authContextValue: AuthContextType = {
    isAuthenticated,  // Determine if the user is authenticated based on the token
    authToken: authToken || '',  // Provide the authToken
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
{/* <AuthContext.Provider
      value={{
        isAuthenticated,
        authToken,
        login,
        logout,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; */}


export default AuthenticateProvider;