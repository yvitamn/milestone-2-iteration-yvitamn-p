
// Frontend representation of a product
export interface ProductsType {
    id: string | number ;
    title: string;
    description: string;
    price: number;
    imageUrl: string; 
    //category: Category;
    quantity: number;
  }
 

// // Category information
// export interface Category {
//     id: number | string ;
//     name: string;
//     description?: string;
//     image?: string; // URL of the category image

//   }

//   export interface categoryWithProducts{
//   category: Category;
//   products: ProductsType[];  // List of products for the category
// }


  
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
  
   
 // User type for registration and login
  export interface User {
    id: number;
    email: string;
    //cart: CartItem[]; 
    name: string; 
} 
 
export interface AuthResponse {
  access_token: string;
  // token_type: string;
  // expires_in: number;
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

