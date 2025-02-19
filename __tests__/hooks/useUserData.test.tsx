import { renderHook } from '@testing-library/react';
import { useUserData } from '@/hooks/useUserData';
import { AuthResponseWithPurchase } from '@/lib/types';

describe('useUserData Hook', () => {
  beforeEach(() => {
    // Clear localStorage before each test to avoid state carryover
    localStorage.clear();
  });

  test('should return user data when authenticated', () => {
    const userData: AuthResponseWithPurchase = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      lastPurchase:[],
    };

    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify(userData));

    const { result } = renderHook(() => useUserData(true));

    expect(result.current.userFetched).toEqual(userData);
    expect(result.current.errorUserData).toBeNull();
  });

  test('should return error when user data is not found', () => {
    localStorage.setItem('token', 'test-token');
    
    const { result } = renderHook(() => useUserData(true));

    expect(result.current.userFetched).toEqual({});
    expect(result.current.errorUserData).toBe('User data not found');
  });

  test('should return error when user data cannot be parsed', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', '{invalid JSON}');

    const { result } = renderHook(() => useUserData(true));

    expect(result.current.userFetched).toEqual({});
    expect(result.current.errorUserData).toBe('Failed to parse user data');
  });

  test('should return null error if unauthenticated', () => {
    const { result } = renderHook(() => useUserData(false));
    expect(result.current.userFetched).toEqual({});
    expect(result.current.errorUserData).toBeNull();
  });
});
