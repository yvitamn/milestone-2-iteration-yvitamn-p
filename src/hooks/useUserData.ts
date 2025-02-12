'use-client';
import { useState, useEffect } from 'react';
import { AuthResponseWithPurchase } from '@/lib/types';
import { fetchUserData } from '@/lib/apiUser';
import { handleApiError } from '@/lib/api';
//import { useAuth } from '@/hooks/useAuth'; 

export const useUserData = (isAuthenticated:boolean) => {
    //const { isAuthenticated } = useAuth();
    const [userFetched, setUser] = useState<AuthResponseWithPurchase | null>(null);
   // const [loadingUser, setLoading] = useState<boolean>(true);
    const [errorUserData, setError] = useState<string | null>(null);


  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      if (token) {
        fetchUserData(token)
         // .then((response) => handleResponse<User>(response)) // Use handleResponse to parse response
          .then((data) => {
            setUser(data); // Assuming `data` is the User object
            setError(null); // Clear any previous errors
          })
          .catch((err) => {
            handleApiError(err); // Handle API error using your utility function
            if (err instanceof Error) {
              setError(err.message); // If it's a generic error, set the message
            } else {
              setError('Failed to fetch user data'); // Fallback error message
            }
          });
          //.finally(() => setLoading(false)); // Ensure loading is false when done
      }
    }
  }, [isAuthenticated]);

  return { userFetched, errorUserData };
};

//export default useUserData;
