import { useContext } from 'react';
import { CartContext } from '../lib/contexts/CartContext';
import { ProductsType } from '../lib/types'; // Import Product type

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  const {
    addedProducts,
    checkout,
    addProductToCart,
    removeProductFromCart,
    updateProductQuantity,
    onCompleteCheckout,
    setCheckout,
    clearCart
  } = context;


  // Helper function to find a product by its ID
  const findProductById = (productId: string | number): ProductsType | undefined => {
    return addedProducts.find((product) => product.id === productId);
  };

  // Function to handle the quantity change
  const handleQuantityChange = (productId: string | number, increment: boolean) => {
  
  const product = findProductById(productId); // Find the product by ID

    if (product) {
      const newQuantity = increment
        ? product.quantity + 1
        : Math.max(product.quantity - 1, 1); // Prevent going below 1

      // Update the quantity using the context's update function
      updateProductQuantity(productId, newQuantity);
    } else {
      console.log('Product not found.');
    }
  };

  return {
    addedProducts,
    checkout,
    addProductToCart,
    removeProductFromCart,
    updateProductQuantity,
    onCompleteCheckout,
    setCheckout,
    handleQuantityChange, // Add the combined action here
    clearCart
  };
};

export default useCart;