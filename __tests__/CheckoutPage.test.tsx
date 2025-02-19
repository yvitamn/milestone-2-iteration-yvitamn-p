import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutPage from './CheckoutPage'; // Adjust the path as necessary
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useUserData } from '@/hooks/useUserData';
import { useRouter } from 'next/navigation';

// Mock hooks
jest.mock('@/hooks/useAuth');
jest.mock('@/hooks/useCart');
jest.mock('@/hooks/useUserData');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('CheckoutPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    mockPush.mockClear();

    // Mock useAuth hook
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true, // Simulate user is logged in
      userData: { name: 'John Doe' },
    });

    // Mock useCart hook
    (useCart as jest.Mock).mockReturnValue({
      addedProducts: [
        { id: 1, title: 'Product 1', price: 20, quantity: 2 },
        { id: 2, title: 'Product 2', price: 15, quantity: 1 },
      ],
      clearCart: jest.fn(),
    });

    // Mock useUserData hook
    (useUserData as jest.Mock).mockReturnValue({
      userFetched: { name: 'John Doe' },
      errorUserData: null,
    });

    // Mock useRouter
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders the checkout page with cart items and user data', () => {
    render(<CheckoutPage />);

    // Check if user data is displayed
    expect(screen.getByText('Hello, John Doe!')).toBeInTheDocument();

    // Check if cart items are displayed
    expect(screen.getByText('Your Cart Items:')).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('Total: $55.00')).toBeInTheDocument(); // Total = (2 * 20) + (1 * 15)

    // Check if payment method selector is present
    expect(screen.getByLabelText('Select Payment Method:')).toBeInTheDocument();
  });

  it('shows an error when no payment method is selected and checkout is attempted', async () => {
    render(<CheckoutPage />);

    fireEvent.click(screen.getByText('Proceed to Checkout'));

    await waitFor(() => {
      expect(screen.getByText('Please select a payment method.')).toBeInTheDocument();
    });
  });

  it('shows loading state when checkout is in progress', async () => {
    render(<CheckoutPage />);

    // Select payment method
    fireEvent.change(screen.getByLabelText('Select Payment Method:'), { target: { value: 'paypal' } });

    // Simulate checkout process
    fireEvent.click(screen.getByText('Proceed to Checkout'));

    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByText('Proceed to Checkout')).toBeDisabled();
  });

  it('shows order success message and clears the cart after successful checkout', async () => {
    const { clearCart } = useCart();
    render(<CheckoutPage />);

    // Select payment method
    fireEvent.change(screen.getByLabelText('Select Payment Method:'), { target: { value: 'paypal' } });

    // Simulate checkout success
    fireEvent.click(screen.getByText('Proceed to Checkout'));

    await waitFor(() => {
      expect(screen.getByText('Your order was successful!')).toBeInTheDocument();
      expect(clearCart).toHaveBeenCalled(); // Ensure cart is cleared after checkout
    });
  });

  it('shows an error message when checkout fails', async () => {
    (useCart as jest.Mock).mockReturnValue({
      addedProducts: [
        { id: 1, title: 'Product 1', price: 20, quantity: 1 },
      ],
      clearCart: jest.fn(),
    });

    render(<CheckoutPage />);

    // Select payment method
    fireEvent.change(screen.getByLabelText('Select Payment Method:'), { target: { value: 'paypal' } });

    // Simulate checkout failure
    const mockError = new Error('Checkout failed. Try again.');
    (global as any).fetch = jest.fn().mockRejectedValue(mockError);

    fireEvent.click(screen.getByText('Proceed to Checkout'));

    await waitFor(() => {
      expect(screen.getByText('Checkout failed. Try again.')).toBeInTheDocument();
    });
  });

  it('redirects to login if user is not authenticated', () => {
    // Mock user not authenticated
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      userData: null,
    });

    render(<CheckoutPage />);

    expect(mockPush).toHaveBeenCalledWith('/checkout');
  });
});
