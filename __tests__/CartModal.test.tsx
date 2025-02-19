import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CartModal from '@/components/CartModal';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
//import { BrowserRouter } from 'react-router-dom';

// Mock hooks
jest.mock('@/hooks/useCart', () => ({
  useCart: jest.fn(),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Mock the CartSummary component
jest.mock('@/components/CartSummary', () => ({
  CartSummary: jest.fn(() => <div>Cart Summary Component</div>),
}));

describe('CartModal Component', () => {
  const mockClose = jest.fn();
  const mockPush = jest.fn();
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should render modal when isOpen is true', () => {
    useCart.mockReturnValue({
      addedProducts: [],
      removeProductFromCart: jest.fn(),
      setCheckout: jest.fn(),
      handleQuantityChange: jest.fn(),
    });
    useAuth.mockReturnValue({
      isAuthenticated: false,
    });

    render(<CartModal isOpen={true} onClose={mockClose} />);

    // Check that modal is rendered
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
  });

  it('should not render modal when isOpen is false', () => {
    render(<CartModal isOpen={false} onClose={mockClose} />);

    // Check that modal is not rendered
    expect(screen.queryByText('Your Cart')).not.toBeInTheDocument();
  });

  it('should call onClose when clicking outside the modal', () => {
    useCart.mockReturnValue({
      addedProducts: [],
      removeProductFromCart: jest.fn(),
      setCheckout: jest.fn(),
      handleQuantityChange: jest.fn(),
    });

    useAuth.mockReturnValue({
      isAuthenticated: false,
    });

    render(<CartModal isOpen={true} onClose={mockClose} />);

    // Simulate click outside the modal to trigger onClose
    fireEvent.mouseDown(document);
    
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('should redirect to login if user is not authenticated', async () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
    });

    useCart.mockReturnValue({
      addedProducts: [],
      removeProductFromCart: jest.fn(),
      setCheckout: jest.fn(),
      handleQuantityChange: jest.fn(),
    });

    render(<CartModal isOpen={true} onClose={mockClose} />);
    
    // Simulate clicking on the checkout button
    fireEvent.click(screen.getByText('Checkout'));

    // Check if router.push is called with '/login' route
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/login'));
  });

  it('should call setCheckout and redirect to /checkout when user is authenticated', async () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
    });

    useCart.mockReturnValue({
      addedProducts: [],
      removeProductFromCart: jest.fn(),
      setCheckout: jest.fn(),
      handleQuantityChange: jest.fn(),
    });

    render(<CartModal isOpen={true} onClose={mockClose} />);

    // Simulate clicking on the checkout button
    fireEvent.click(screen.getByText('Checkout'));

    // Check if setCheckout is called and if router.push is called with '/checkout'
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/checkout'));
    expect(mockPush).toHaveBeenCalledTimes(1);
  });

  it('should call removeProductFromCart when remove button is clicked', () => {
    const mockRemove = jest.fn();
    useCart.mockReturnValue({
      addedProducts: [{ id: '1', title: 'Test Product', price: 100 }],
      removeProductFromCart: mockRemove,
      setCheckout: jest.fn(),
      handleQuantityChange: jest.fn(),
    });

    render(<CartModal isOpen={true} onClose={mockClose} />);

    // Simulate remove product click
    fireEvent.click(screen.getByText('Remove'));

    expect(mockRemove).toHaveBeenCalledTimes(1);
  });

  it('should update product quantity when quantity is changed', () => {
    const mockUpdateQuantity = jest.fn();
    useCart.mockReturnValue({
      addedProducts: [{ id: '1', title: 'Test Product', price: 100, quantity: 1 }],
      removeProductFromCart: jest.fn(),
      setCheckout: jest.fn(),
      handleQuantityChange: mockUpdateQuantity,
    });

    render(<CartModal isOpen={true} onClose={mockClose} />);

    // Simulate quantity change
    fireEvent.change(screen.getByLabelText('Quantity'), { target: { value: '2' } });

    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 2);
  });
});