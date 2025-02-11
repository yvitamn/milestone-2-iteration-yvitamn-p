import { AuthResponse, ApiErrorData } from '@/lib/types';

const BASE_URL = "https://api.escuelajs.co/api/v1";


export const fetchUserData = async (token: string): Promise<AuthResponse | ApiErrorData> => {
    try {
      const res = await fetch(`${BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        const errorData: ApiErrorData = await res.json();
        return errorData;  // Return the error data if the response is not OK
      }
  
      // If the response is OK, parse the user data
      const data: AuthResponse = await res.json();
      return data;  // Return the user data if the response is successful
    } catch (error) {
      return {
        message: 'Failed to fetch user data.',
        statusCode: 500,
      };
    }
  };
  