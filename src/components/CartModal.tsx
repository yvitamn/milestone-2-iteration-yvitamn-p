'use client';
import React, { useRef, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { CartSummary } from '@/components/CartSummary';
import { useAuth } from '@/hooks/useAuth';
import { CartModalProps } from '@/lib/types';
import { useRouter } from 'next/router';
import { ShoppingCart, X } from 'lucide-react';

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();  // Get auth status
  const { 
      addedProducts,
      removeProductFromCart, 
      setCheckout,
      handleQuantityChange

    } = useCart();
 
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close the modal when clicking outside of it
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    // Add event listener for outside clicks
    document.addEventListener('mousedown', handleOutsideClick);
    // Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  

  const handleCompleteCheckout = () => {
      if (!isAuthenticated) {
        // If user is not authenticated, redirect to login page
        router.push('/login');
        return;
      }
      setCheckout(true); // Set checkout status to true    
      router.push('/checkout'); // Redirect to checkout page
      
    };


    

      if (!isOpen) return null; // If modal isn't open, don't render

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-4/5 sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-800"
        >
         <X />
        </button>

        {/* Modal Header with ShoppingCart Icon */}
        <h2 className="text-2xl font-bold mb-4 text-center flex justify-center items-center gap-2">
          <ShoppingCart size={24} /> {/* Cart Icon */}
          Your Cart
        </h2>

        {/* Pass props to CartSummary for cart-related logic */}
        <CartSummary       
        cartItems={addedProducts}          // Cart items (products)
        removeProductFromCart={removeProductFromCart}   // Function to remove product
        onCompleteCheckout={handleCompleteCheckout}     // Function to complete checkout                     
        updateProductQuantity={handleQuantityChange}  // Function to update quantity   
        />



      </div>
    </div>
  );
};

export default CartModal;
