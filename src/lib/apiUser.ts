'use client';
import { AuthResponse, ApiErrorData, AuthResponseWithPurchase } from '@/lib/types';

const BASE_URL = "https://api.escuelajs.co/api/v1";


export const fetchUserData = async (accessToken: string): Promise<AuthResponse> => {
   
    try {
      const response = await fetch(`${BASE_URL}/userData`, {
        //method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) {
        const errorData: ApiErrorData = await response.json();
        throw new Error(`API Error: ${errorData.message} (Code: ${errorData.statusCode})`);
      }
  
      const userDataApi: AuthResponseWithPurchase = await response.json();
      return userDataApi; // Return user data as AuthResponse
  
    } catch (error) {
        console.error('Error fetching user data:', error);
        if (error instanceof Error) {
          console.error('Error Message:', error.message);
        }
        throw error;
      }
    };