// import { render, fireEvent, screen, waitFor } from '@testing-library/react';
// import CartModal from '@/components/CartModal';
// import { useCart } from '@/hooks/useCart';
// import { useAuth } from '@/hooks/useAuth';
// import { useRouter } from 'next/router';

// // Mocking the useCart and useAuth hooks
// jest.mock('@/hooks/useCart', () => ({
//   useCart: jest.fn(),
// }));

// jest.mock('@/hooks/useAuth', () => ({
//   useAuth: jest.fn(),
// }));

// jest.mock('next/router', () => ({
//   useRouter: jest.fn(),
// }));

// describe('CartModal', () => {
//   const mockPush = jest.fn();
//   const mockOnClose = jest.fn();

//   // Mock useRouter to return the mockPush function
//   beforeEach(() => {
//     (useRouter as jest.Mock).mockReturnValue({
//       push: mockPush,
//     });

//     // Mock the useCart hook to return test data
//     (useCart as jest.Mock).mockReturnValue({
//       addedProducts: [
//         { id: 1, title: 'Product 1', price: 10, quantity: 2, imageUrl: ['url1'], description: '', category: { id: 1, name: 'Category 1' } },
//         { id: 2, title: 'Product 2', price: 20, quantity: 1, imageUrl: ['url2'], description: '', category: { id: 2, name: 'Category 2' } },
//       ],
//       removeProductFromCart: jest.fn(),
//       setCheckout: jest.fn(),
//       handleQuantityChange: jest.fn(),
//     });

//     // Mock the useAuth hook to simulate an authenticated user
//     (useAuth as jest.Mock).mockReturnValue({
//       isAuthenticated: true,
//     });
//   });

//   test('calls onClose when clicking outside of the modal', () => {
//     render(<CartModal isOpen={true} onClose={mockOnClose} />);

//     // Simulate clicking outside the modal to close it
//     fireEvent.mouseDown(document.body);
    
//     // Check that the onClose function is called
//     expect(mockOnClose).toHaveBeenCalledTimes(1);
//   });

  
//   test('does not render CartModal when isOpen is false', () => {
//     render(<CartModal isOpen={false} onClose={mockOnClose} />);

//     // CartModal should not render when isOpen is false
//     expect(screen.queryByText('Your Cart')).toBeNull();
//   });

//   test('closes modal when clicking on the close button', () => {
//     render(<CartModal isOpen={true} onClose={mockOnClose} />);

//     // Click on the close button
//     fireEvent.click(screen.getByRole('button'));

//     // Check if onClose is called
//     expect(mockOnClose).toHaveBeenCalledTimes(1);
//   });

//   test('closes modal when clicking outside the modal', async () => {
//     render(<CartModal isOpen={true} onClose={mockOnClose} />);

//     // Simulate clicking outside the modal
//     fireEvent.mouseDown(document.body);

//     // Wait for the modal to be closed
//     await waitFor(() => expect(mockOnClose).toHaveBeenCalledTimes(1));
//   });

//   test('redirects to login page when user is not authenticated and checkout is attempted', () => {
//     // Mock the useAuth hook to simulate an unauthenticated user
//     (useAuth as jest.Mock).mockReturnValue({
//       isAuthenticated: false,
//     });

//     render(<CartModal isOpen={true} onClose={mockOnClose} />);

//     // Click on checkout button (or trigger the checkout process)
//     fireEvent.click(screen.getByText('Checkout'));

//     // Check that router.push() is called to redirect to login
//     expect(mockPush).toHaveBeenCalledWith('/login');
//   });

//   test('completes checkout when user is authenticated', () => {
//     render(<CartModal isOpen={true} onClose={mockOnClose} />);

//     // Click on checkout button (trigger the checkout process)
//     fireEvent.click(screen.getByText('Checkout'));

//     // Check that router.push() redirects to checkout
//     expect(mockPush).toHaveBeenCalledWith('/checkout');
//   });

//   test('displays cart items from CartSummary', () => {
//     const mockCartItems = [
//       { id: 1, title: 'Product 1', price: 10, quantity: 1, imageUrl: 'url1', description: 'Product 1 description', category: { id: 1, name: 'Category 1' } },
//     ];

//     // Mock useCart to return the mockCartItems
//     (useCart as jest.Mock).mockReturnValue({
//       addedProducts: mockCartItems,
//       removeProductFromCart: jest.fn(),
//       setCheckout: jest.fn(),
//       handleQuantityChange: jest.fn(),
//     });

//     render(<CartModal isOpen={true} onClose={mockOnClose} />);

//     // Check if the cart items are rendered
//     expect(screen.getByText('Product 1')).toBeInTheDocument();
//     expect(screen.getByText('$10.00')).toBeInTheDocument();
//   });
// });
