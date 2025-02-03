

import { createContext } from 'react';
import { Product } from '@/lib/types'; 



export interface CartContextType {
  addedProducts: Product[];
  checkout: boolean;
  addProductToCart: (product: Product) => void;
  updateProductQuantity: (productId: string | number, quantity: number) => void;
  removeProductFromCart: (productId: string | number) => void;
  onCompleteCheckout: () => void;
  setCheckout: (checkout: boolean) => void; // Method to update checkout state
  clearCart: () => void;  
}

// Create the CartContext with a default value of undefined (for later checking)
export const CartContext = createContext<CartContextType | null>(null);


//export default CartContext;



