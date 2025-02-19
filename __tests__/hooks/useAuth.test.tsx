import { renderHook } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { AuthContextType } from '@/lib/contexts/AuthContext';
import { User } from '@/lib/types';


// Define a mock user object
const mockUserData: User = {
    id: 1,
    email: 'testuser@example.com',
    name: 'Test User',
};
// Mock the AuthContext provider
const mockAuthContextValue: AuthContextType = {
  isAuthenticated: true,
  userLogin: mockUserData,
  userData: mockUserData,
  errorUserData: null,
  token: 'test-token',
  login: jest.fn(),
  logout: jest.fn(),
  signup: jest.fn(),
};

jest.mock('@/lib/contexts/AuthContext', () => ({
  useContext: jest.fn().mockReturnValue(mockAuthContextValue),
}));

describe('useAuth Hook', () => {
  test('should return the correct authentication data', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userData).toEqual({ id: 1, name: 'Test User' });
    expect(result.current.errorUserData).toBeNull();
    expect(result.current.token).toBe('test-token');
  });

  test('should throw error if useAuth is not wrapped in AuthProvider', () => {
    jest.mock('@/lib/contexts/AuthContext', () => ({
      useContext: jest.fn().mockReturnValue(null),
    }));

    expect(() => renderHook(() => useAuth())).toThrow(
        'useAuth must be used within an AuthenticateProvider');
  });
});
