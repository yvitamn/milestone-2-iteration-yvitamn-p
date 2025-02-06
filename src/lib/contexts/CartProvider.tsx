import { ReactNode, useState } from 'react';
import { ProductsType } from '@/lib/types';
import { CartContext } from '@/lib/contexts/CartContext';

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [addedProducts, setAddedProducts] = useState<ProductsType[]>([]); // State for added products
  const [checkout, setCheckout] = useState<boolean>(false); // State for checkout status

  // Add product to cart
  const addProductToCart = (product: ProductsType) => {
    setAddedProducts((prevProducts) => {
      const existingProduct = prevProducts.find((p) => p.id === product.id);
      if (existingProduct) {
        return prevProducts.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prevProducts, { ...product, quantity: 1 }];
    });
  };

  const removeProductFromCart = (productId: string | number) => {
    setAddedProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  };

  const updateProductQuantity = (productId: string | number, quantity: number) => {
    setAddedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, quantity } : product
      )
    );
  };

  // Clear the cart
  const clearCart = () => {
    setAddedProducts([])
  }
  const onCompleteCheckout = () => {
    setCheckout(true);
  };

  // Set checkout status
  const setCheckoutStatus = (checkout: boolean) => {
    setCheckout(checkout);
  };

  return (
    <CartContext.Provider value={{
      addedProducts, 
      checkout, 
      addProductToCart, 
      removeProductFromCart, 
      onCompleteCheckout,
      updateProductQuantity,
      setCheckout: setCheckoutStatus, // Using setCheckout here
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

