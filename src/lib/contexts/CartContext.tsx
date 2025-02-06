

import { createContext } from 'react';
import { ProductsType } from '@/lib/types'; 



export interface CartContextType {
  addedProducts: ProductsType[];
  checkout: boolean;
  addProductToCart: (product: ProductsType) => void;
  updateProductQuantity: (productId: string | number, quantity: number) => void;
  removeProductFromCart: (productId: string | number) => void;
  onCompleteCheckout: () => void;
  setCheckout: (checkout: boolean) => void; // Method to update checkout state
  clearCart: () => void;  
}

// Create the CartContext with a default value of undefined (for later checking)
export const CartContext = createContext<CartContextType | null>(null);


//export default CartContext;



