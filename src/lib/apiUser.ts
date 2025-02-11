import { AuthResponse, ApiErrorData } from '@/lib/types';

const BASE_URL = "https://api.escuelajs.co/api/v1";


export const fetchUserData = async (accessToken: string) => {
    try {
      const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
  
      const userData = await response.json();
      return userData; // Return user data
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error; // Throw error to be handled in the calling function
    }
  };
  