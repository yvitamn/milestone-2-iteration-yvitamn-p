import { render, fireEvent, screen } from '@testing-library/react';
import CheckoutAuth from '@/components/CheckoutAuth';
import LoginPage from '@/components/LoginPage';
import SignupPage from '@/components/SignupPage';

// Mock LoginPage and SignupPage components
jest.mock('@/components/LoginPage', () => () => <div>LoginPage Component</div>);
jest.mock('@/components/SignupPage', () => () => <div>SignupPage Component</div>);

describe('CheckoutAuth', () => {
  test('renders LoginPage by default', () => {
    render(<CheckoutAuth />);

    // Check if LoginPage is rendered initially
    expect(screen.getByText('LoginPage Component')).toBeInTheDocument();
  });

  test('renders SignupPage when toggle button is clicked', () => {
    render(<CheckoutAuth />);

    // Click the toggle button to switch to the Signup page
    fireEvent.click(screen.getByText("Don’t have an account? Sign up here."));

    // Check if SignupPage is rendered
    expect(screen.getByText('SignupPage Component')).toBeInTheDocument();
  });

  test('renders LoginPage again when toggle button is clicked', () => {
    render(<CheckoutAuth />);

    // Click to go to Signup page first
    fireEvent.click(screen.getByText("Don’t have an account? Sign up here."));

    // Then click again to toggle back to Login page
    fireEvent.click(screen.getByText('Already have an account? Log in here.'));

    // Check if LoginPage is rendered again
    expect(screen.getByText('LoginPage Component')).toBeInTheDocument();
  });

  test('button text toggles correctly between login and signup', () => {
    render(<CheckoutAuth />);

    // Check if the initial button text is "Don’t have an account? Sign up here."
    expect(screen.getByText("Don’t have an account? Sign up here.")).toBeInTheDocument();

    // Click to go to Signup page
    fireEvent.click(screen.getByText("Don’t have an account? Sign up here."));

    // Check if the button text changes to "Already have an account? Log in here."
    expect(screen.getByText('Already have an account? Log in here.')).toBeInTheDocument();

    // Click to go back to Login page
    fireEvent.click(screen.getByText('Already have an account? Log in here.'));

    // Check if the button text is back to the original
    expect(screen.getByText("Don’t have an account? Sign up here.")).toBeInTheDocument();
  });
});
