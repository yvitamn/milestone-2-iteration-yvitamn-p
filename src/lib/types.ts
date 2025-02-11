
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

  
export interface AuthResponse {
  token: boolean;
  user: User;
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
    //access_token: string;
    user: User;
  }
  
  
  
  // // API Error type
  // export interface ApiErrorData {
  //   message: string;
  //   statusCode?: number;
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

