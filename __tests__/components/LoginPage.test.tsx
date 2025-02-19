import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/components/LoginPage'; // adjust the import path as needed
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

// Mock the useAuth hook and useRouter hook
jest.mock('@/hooks/useAuth');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('LoginPage', () => {
  const mockLogin = jest.fn();
  const mockPush = jest.fn();
  
  beforeEach(() => {
    // Reset mocks before each test
    mockLogin.mockClear();
    mockPush.mockClear();

    // Mock useAuth hook
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      login: mockLogin,
    });

    // Mock useRouter hook
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders login form when not authenticated', () => {
    render(<LoginPage />);

    expect(screen.getByText('Please Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('shows error message when email or password is missing', async () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => expect(screen.getByText('Please enter both email and password')).toBeInTheDocument());
  });

  it('shows loading state when login is in progress', async () => {
    render(<LoginPage />);
    
    // Simulate input change
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    
    // Simulate form submission
    fireEvent.click(screen.getByText('Login'));
    
    // Check loading state
    expect(screen.getByText('Logging in...')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeDisabled();
  });

  it('calls login function and redirects on successful login', async () => {
    mockLogin.mockResolvedValueOnce(true); // Simulate successful login
    
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
      expect(mockPush).toHaveBeenCalledWith('/products'); // Check if the user is redirected
    });
  });

  it('shows error message on login failure', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Login failed')); // Simulate failed login
    
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });
    
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => expect(screen.getByText('Invalid email or password')).toBeInTheDocument());
  });

  it('redirects to products page if already authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      login: mockLogin,
    });
    render(<LoginPage />);

    expect(mockPush).toHaveBeenCalledWith('/products'); // Check if redirect occurs
  });
});
