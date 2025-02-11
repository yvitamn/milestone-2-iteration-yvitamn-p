import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { fetchUserData } from '@/lib/api';


const useUserData = (isAuthenticated: boolean) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      if (token) {
        fetchUserData(token)
          .then((data) => {
            if ('message' in data) {
              setError(data.message);
            } else {
              setUser(data.user);
            }
          })
          .catch(() => setError('Failed to fetch user data'))
          .finally(() => setLoading(false));
      }
    }
  }, [isAuthenticated]);

  return { user, loading, error };
};

export default useUserData;
