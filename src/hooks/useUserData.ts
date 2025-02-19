'use-client';
import { useState, useEffect } from 'react';
import { AuthResponseWithPurchase } from '@/lib/types';


export const useUserData = (isAuthenticated: boolean) => {
    const [userFetched, setUserFetched] = useState<AuthResponseWithPurchase> ({} as AuthResponseWithPurchase);
    const [errorUserData, setError] = useState<string | null>(null);


  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');

      if (token) {
        // Assuming that the user data comes directly from context or somewhere else
        // Instead of fetching data, just update the state based on the authenticated user.
        const storedUserData = localStorage.getItem('user');
        if (storedUserData) {
          try {
            const parsedUserData: AuthResponseWithPurchase = JSON.parse(storedUserData);
           
           // Ensure the id is a number
          const validUser = {
            ...parsedUserData,
            id: Number(parsedUserData.id),
          };
           
            setUserFetched(validUser); // Set the fetched user data
            setError(null);  // Clear any previous errors
          } catch (err) {
            setError('Failed to parse user data');
          }
        } else {
          setError('User data not found');
        }
      }
    }
  }, [isAuthenticated]);

  return { userFetched, errorUserData };
};


