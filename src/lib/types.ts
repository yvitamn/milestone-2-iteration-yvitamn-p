
// Frontend representation of a product
export interface ProductsType {
    id: string | number;
    title: string;
    description: string;
    price: number;
    images: string[]; 
    category: Category;
    quantity: number;
  }
 

// Category information
export interface Category {
    id: string | number;
    name: string;
    description?: string;
    image?: string; // URL of the category image
  }

  // export type HomePageData = {
  //       products: {
  //         id: string | number;
  //         title: string;
  //         price: number;
  //         description: string;
  //         category: Category;
  //         images: string[];
  //     }[];
  //       categories: {
  //         id: number;
  //         name: string;
  //         description?: string;
  //         image?: string;
  //       }[];
  //     };


  
    export interface ApiErrorData {
    message: string;
    statusCode?: number;
  }

  
export interface AuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
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
    password: string; // Only for registration
    name: string;
    
} 
  
  // Login response type
  export interface LoginResponse {
    access_token: string;
    user: User;
  }
  
  // Statistics type
  export interface Stats {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
  }
  
  // API Error type
  export interface ApiErrorData {
    message: string;
    statusCode?: number;
  }
  

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
  

  // Custom API Error class
export class ApiError extends Error {
    constructor(
      public status: number,
      message: string,
      public data?: Record<string, unknown>
    ) {
      super(message);
      this.name = "ApiError";
    }
  }

