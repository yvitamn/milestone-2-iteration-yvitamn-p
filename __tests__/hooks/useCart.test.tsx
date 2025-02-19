import { renderHook, act } from '@testing-library/react';
import { useCart } from '@/hooks/useCart';
import { CartContextType } from '@/lib/contexts/CartContext';

// Mock the CartContext provider
const mockContextValue: CartContextType = {
  addedProducts: [
    { id: 1, title: 'Product 1', price: 10, quantity: 2, imageUrl: ['url1'], description: '', category: { id: 1, name: 'Category 1' } },
    { id: 2, title: 'Product 2', price: 20, quantity: 1, imageUrl: ['url2'], description: '', category: { id: 2, name: 'Category 2' } },
  ],
  checkout: false,
  addProductToCart: jest.fn(),
  removeProductFromCart: jest.fn(),
  updateProductQuantity: jest.fn(),
  onCompleteCheckout: jest.fn(),
  setCheckout: jest.fn(),
  clearCart: jest.fn(),
};

jest.mock('@/lib/contexts/CartContext', () => ({
  useContext: jest.fn(),
}));

describe('useCart Hook', () => {
  test('should return the correct addedProducts', () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.addedProducts).toEqual(mockContextValue.addedProducts);
  });

  test('should call handleQuantityChange correctly', () => {
    const { result } = renderHook(() => useCart());

    const productId = 1;
    const increment = true;

    act(() => {
      result.current.handleQuantityChange(productId, increment);
    });

    expect(mockContextValue.updateProductQuantity).toHaveBeenCalledWith(productId, 3); // 2 + 1
  });

  test('should throw error if useCart is not wrapped in CartProvider', () => {
    jest.mock('@/lib/contexts/CartContext', () => ({
      useContext: jest.fn().mockReturnValue(null),
    }));

    expect(() => renderHook(() => useCart())).toThrow('useCart must be used within a CartProvider');
  });
});
