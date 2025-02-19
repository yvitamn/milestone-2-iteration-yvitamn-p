import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { CartSummary } from '@/components/CartSummary'; // Adjust the import path

// Mock props
const mockRemoveProductFromCart = jest.fn();
const mockOnCompleteCheckout = jest.fn();
const mockUpdateProductQuantity = jest.fn();

// const mockCartItems = [
//   { id: 1, title: 'Product 1', price: 10, quantity: 2, imageUrl: ['url1'] },
//   { id: 2, title: 'Product 2', price: 20, quantity: 1, imageUrl: ['url2'] },
// ];

const mockCartItems = [
    {
      id: 1,
      title: 'Product 1',
      price: 10,
      quantity: 2,
      imageUrl: 'url1', // Single string instead of an array
      description: 'Description for Product 1',
      category: { id: 1, name: 'Category 1' }, // Category is an object, not a string
    },
    {
      id: 2,
      title: 'Product 2',
      price: 20,
      quantity: 1,
      imageUrl: 'url2', // Single string instead of an array
      description: 'Description for Product 2',
      category: { id: 2, name: 'Category 2' }, // Category is an object
    },
  ];
  
  

const renderComponent = (cartItems = mockCartItems) =>
  render(
    <CartSummary
      cartItems={cartItems}
      removeProductFromCart={mockRemoveProductFromCart}
      onCompleteCheckout={mockOnCompleteCheckout}
      updateProductQuantity={mockUpdateProductQuantity}
    />
  );

describe('CartSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, 'setInterval');
    jest.spyOn(window, 'clearInterval');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders empty message when cart is empty', () => {
    const { getByText } = renderComponent([]);
    expect(getByText('Your cart is empty!')).toBeInTheDocument();
  });

  test('renders cart items when cart is not empty', () => {
    const { getByText } = renderComponent();
    expect(getByText('Product 1')).toBeInTheDocument();
    expect(getByText('Product 2')).toBeInTheDocument();
  });

  test('calculates and displays correct total price', () => {
    const { getByText } = renderComponent();
    expect(getByText('$40.00')).toBeInTheDocument();
  });

  test('calls updateProductQuantity when quantity buttons are clicked', () => {
    const { getAllByText } = renderComponent();
    const incrementButtons = getAllByText('+');
    const decrementButtons = getAllByText('-');

    fireEvent.click(incrementButtons[0]);
    expect(mockUpdateProductQuantity).toHaveBeenCalledWith(1, true);

    fireEvent.click(decrementButtons[0]);
    expect(mockUpdateProductQuantity).toHaveBeenCalledWith(1, false);
  });

  test('disables decrement button when quantity is 1', () => {
    const { getAllByText } = renderComponent();
    const decrementButtons = getAllByText('-');
    expect(decrementButtons[1]).toBeDisabled(); // Second item has quantity 1
  });

  test('calls removeProductFromCart when remove button is clicked', () => {
    const { getAllByText } = renderComponent();
    const removeButtons = getAllByText('Remove');
    
    fireEvent.click(removeButtons[0]);
    expect(mockRemoveProductFromCart).toHaveBeenCalledWith('1');
  });

  test('checkout button is disabled when cart is empty', () => {
    const { getByText } = renderComponent([]);
    expect(getByText('Checkout')).toBeDisabled();
  });

  test('checkout button is enabled when cart has items', () => {
    const { getByText } = renderComponent();
    expect(getByText('Checkout')).not.toBeDisabled();
  });

  test('updates total price when cartItems change', () => {
    const { rerender, getByText } = renderComponent();
    const newItems = [...mockCartItems, { id: 3, title: 'Product 3', price: 30, quantity: 3, imageUrl: ['url3'] }];
    
    rerender(
      <CartSummary
        cartItems={newItems}
        removeProductFromCart={mockRemoveProductFromCart}
        onCompleteCheckout={mockOnCompleteCheckout}
        updateProductQuantity={mockUpdateProductQuantity}
      />
    );

    expect(getByText('$130.00')).toBeInTheDocument();
  });

  test('sets up and cleans up interval correctly', () => {
    const { unmount } = renderComponent();
    
    expect(window.setInterval).toHaveBeenCalledWith(expect.any(Function), 5000);
    
    unmount();
    expect(window.clearInterval).toHaveBeenCalledTimes(1);
  });

  test('recalculates total price after interval', () => {
    jest.useFakeTimers();
    const { getByText } = renderComponent();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(getByText('$40.00')).toBeInTheDocument();
    jest.useRealTimers();
  });
});