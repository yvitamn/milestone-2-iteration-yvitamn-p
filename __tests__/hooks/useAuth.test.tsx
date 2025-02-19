import { render, screen } from '@testing-library/react';
import { AuthContext } from '@/lib/contexts/AuthContext'; // Your actual context
import TestComponent from '@/components/test/TestComponent'; // The component that uses useAuth
import { useUserData } from '@/hooks/useUserData';
import { AuthResponseWithPurchase } from '@/lib/types';

jest.mock ('@/hooks/useUserData');

describe('TestComponent', () => {
  it('should display the correct user name when authenticated', () => {
    // Create the mock context value for an authenticated user
    const mockAuthContextValue = {
      userLogin: { 
        id: '12345', 
        name: 'Test User', 
        email: 'testuser@example.com'
      },
      isAuthenticated: true,
      userData: { 
        id: '12345', 
        name: 'Test User', 
        email: 'testuser@example.com'
      },
      token: 'mock-token',
      login: jest.fn(),
      logout: jest.fn(),
      signup: jest.fn(),
      errorUserData: null,
    };

        const mockUserData: AuthResponseWithPurchase = {
                id: '12345', 
                name: 'Test User', 
                email: 'testuser@example.com'
        };

    // Mocking the useUserData hook to simulate API behavior
    (useUserData as jest.Mock).mockReturnValue({
        userFetched: { 
            id: '12345', 
            email: 'testuser@example.com', 
            name: 'Test User' 
        },
        errorUserData: null,
      });

    // Render the component wrapped with the mock context
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <TestComponent />
      </AuthContext.Provider>
    );

    // Verify that the correct text is displayed when the user is authenticated
    expect(screen.getByText('Welcome, Test User')).toBeInTheDocument();
  });


  
  it('should display "Please log in" when not authenticated', () => {
    // Create the mock context value for a non-authenticated user
    const mockAuthContextValue = {
        userLogin:null,
        isAuthenticated: false,
        userData: null,
        token: null,
        login: jest.fn(),
        logout: jest.fn(),
        signup: jest.fn(),
        errorUserData: null,
    };

    // Render the component wrapped with the mock context
    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <TestComponent />
      </AuthContext.Provider>
    );

    // Verify that the "Please log in" message is displayed when the user is not authenticated
    expect(screen.getByText('Please log in.')).toBeInTheDocument();
  });
});
