// import { useState, useEffect, ReactNode } from 'react';
// import { AuthContext, AuthContextType } from '@/lib/contexts/AuthContext';  
// import { useAuth } from '@/hooks/useAuth';
// import { useRouter } from 'next/router';
// import { User, LoginResponse } from '@/lib/types';

// const BASE_URL = "https://api.escuelajs.co/api/v1";

// // Provider component that wraps the app and provides authentication state
// export const AuthenticateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
 
 
//   const login = async (credentials: { email: string; password: string }) => {
//     try {
//       const response = await fetch(`${BASE_URL}/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(credentials),
//       });

//       const data: LoginResponse = await response.json();
//       if (!response.ok) {
//         throw new Error('Login failed');
//       }

//        // Set user data in local storage (simplified for this example)
//        localStorage.setItem('user', JSON.stringify(data.user));
//        setUser(data.user);
//        setIsAuthenticated(true);
//     } catch (error) {
//       console.error('Login failed:', error);
//       throw error;
//     }
//   };

//   const logout = () => {
//     // Clear token and user state
//     localStorage.removeItem('token');
//     setAuthToken(null);  // Clear token from state
//     setUser(null);
//     setIsAuthenticated(false);
//     router.push('/login'); // Redirect to login page

//   };

//   //Define the authContextValue using AuthContextType
//   const authContextValue: AuthContextType = {
//     isAuthenticated,  // Determine if the user is authenticated based on the token
//     authToken: authToken || '',  // Provide the authToken
//     login,
//     logout,
//     user,
//   };

//   return (
//     <AuthContext.Provider value={authContextValue}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



// export default AuthenticateProvider;