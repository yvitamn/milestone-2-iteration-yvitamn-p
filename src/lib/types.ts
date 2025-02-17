'use client';

import { ParsedUrlQuery } from 'querystring';

// Frontend representation of a product
export interface ProductsType {
    id: string | number ;
    title: string;
    description: string;
    price: number;
    imageUrl: string; 
    quantity: number;
    category: CategoryType;
  }


  export interface Params extends ParsedUrlQuery {
    id: string; 
    
  }

 // Category information
export interface CategoryType {
    id: number | string ;
    name: string;
    description?: string;
    image?: string; // URL of the category image
  }


      export interface ApiErrorData {
    message: string;
    statusCode?: number;
  }

 
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData extends LoginCredentials {
    name: string;
  }
  
   
 // User type after registration and login
  export interface User {
    id: number;
    email: string;
    //cart: CartItem[]; 
    name: string; 
} 
 
// Include user info in authres
export interface AuthResponse {
    access_token: string;
    id: number;
    email: string;
    name: string; 
  // token_type: string;
  // expires_in: number;
  }

  export interface AuthResponseWithPurchase extends AuthResponse {
    lastPurchase?: { 
      productId: number;
      name: string;
      price: number;
    }[]; 
  }
  
  // export interface CheckoutFormData {
  //   email: string;
  //   name: string;
  //   address: string;
  //   city: string;
  //   country: string;
  //   postalCode: string;
  //   cardNumber: string;
  //   cardExpiry: string;
  //   cardCvc: string;
  // }
  
  // export interface ApiErrorData {
  //   message?: string;
  //   details?: string;
  // }
  
  // export interface OrderItem {
  //   id: number;
  //   productId: number;
  //   quantity: number;
  //   price: number;
  //   product: ProductsType;
  // }
  

  // export interface Order {
  //   id: number;
  //   userId: number;
  //   items: OrderItem[];
  //   status: string;
  //   total: number;
  //   shipping: number;
  //   tax: number;
  //   createdAt: string;
  //   updatedAt: string;
  //   shippingAddress?: {
  //     street: string;
  //     city: string;
  //     state: string;
  //     country: string;
  //     zipCode: string;
  //   };
  //   paymentMethod?: {
  //     type: string;
  //     lastFour?: string;
  //     expiryDate?: string;
  //   };
  // }

// Interface for CartModal props
export interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: ProductsType[];
   
  }
  
  // Interface for CartSummary props
  export interface CartSummaryProps {
    cartItems: ProductsType[];
    removeProductFromCart: (productId: string) => void;
    onCompleteCheckout: () => void;
    updateProductQuantity: (productId: string | number, increment: boolean) => void;
  }


  
  
//   export interface CheckoutFormData {
//     email: string;
//     name: string;
//     address: string;
//     city: string;
//     country: string;
//     postalCode: string;
//   }
  

  //Custom API Error class
export class ApiError extends Error {
    // constructor(
    //   public status: number,
    //   message: string,
    //   public data?: Record<string, unknown>
    // ) {
    //   super(message);
    //   this.name = "ApiError";
    // }

    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
    }
  }

