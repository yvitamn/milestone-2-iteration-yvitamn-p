'use client';
import { useState, useEffect, useCallback } from 'react';
import { CartSummaryProps } from '@/lib/types';
//import { useCartActions } from '../hooks/useCartActions'


export const CartSummary: React.FC<CartSummaryProps> = ({
  cartItems,
  removeProductFromCart,
  onCompleteCheckout,
  updateProductQuantity, 
}) => {
  const [totalPrice, setTotalPrice] = useState<number>(0);

 // Memoized function to calculate total price
 const calculateTotalPrice = useCallback(() => {
  const total = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  setTotalPrice(total);
}, [cartItems]);

// Update the total price when cart items change
useEffect(() => {
  calculateTotalPrice();
}, [cartItems, calculateTotalPrice]);


  // Use setInterval to simulate real-time updates (every 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      calculateTotalPrice();
    }, 5000); // Update total price every 3 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [cartItems, calculateTotalPrice]);

  return (
    <div className="max-h-64 overflow-y-auto mb-4">
    {/* If no items in the cart, show an empty message */}
    {cartItems.length === 0 ? (
      <p>Your cart is empty!</p>

    ) : (
      <ul className="space-y-4">
        {cartItems.map((item) => (
          <li key={item.id} className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-16 h-16 object-cover"
              />
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-600">
                  ${item.price} x{' '}
                  <div className="flex items-center space-x-2">
                    {/* Decrement Button */}
                    <button
                      onClick={() => updateProductQuantity(item.id, false)}
                      className="px-2 py-1 bg-gray-300 rounded-full text-lg"
                      disabled={item.quantity <= 1} // Disable decrement when quantity is 1
                    >
                      -
                    </button>

                    {/* Quantity Display */}
                    <span className="text-lg">{item.quantity}</span>

                    {/* Increment Button */}
                    <button
                      onClick={() => updateProductQuantity(item.id, true)}
                      className="px-2 py-1 bg-gray-300 rounded-full text-lg"
                    >
                      +
                    </button>
                  </div>
                </p>
              </div>
            </div>
            {/* Remove Button */}
            <button
              onClick={() => removeProductFromCart(String(item.id))}
              className="text-red-500 hover:text-red-700 font-semibold"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    )}

    {/* Total Price */}
    <div className="mt-4 text-lg font-semibold">
      <p>Total Price: </p>
      <p className="text-xl text-green-500 font-bold">${totalPrice.toFixed(2)}</p>
    </div>

    {/* Checkout Buttons */}
    <div className="mt-6 flex justify-between items-center">  
      <button
        onClick={onCompleteCheckout}
        disabled={cartItems.length === 0}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        Checkout
      </button>
    </div>
  </div>
);
};