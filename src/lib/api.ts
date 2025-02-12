'use client';

import {  
      ProductsType,   
      //Category,
      AuthResponse,
      LoginCredentials,
      RegisterData,    
    } from '@/lib/types';

// Base URL for the API
const BASE_URL = "https://api.escuelajs.co/api/v1";



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

// Utility function to handle API responses
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(response.status, error.message || "API Error", error);
  }
  return response.json();
}

// Utility function to handle API errors
export async function handleApiError(error: unknown) {
  if (error instanceof Response) {
    const data = await error.json();
    throw new ApiError(error.status, data.message || "API Error", data);
  }
  if (error instanceof ApiError) {
    throw error;
  }
  throw new Error("Unknown error occurred");
}


//--------------------------------------------------
// Function to fetch all products
export const fetchProducts = async (): Promise<ProductsType[]> => {
  try {
    const response = await fetch(`${BASE_URL}/products`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: {
      id: string | number;
      title: string;
      description: string;
      price: number;
      images: string[]; 
      //category: { id: string | number; name: string; image: string };
      
    }[]  = await response.json(); // Inline the type
    console.log('Fetched products:', data); 

   // Ensure that the response is an array and has the necessary properties
   if (
    !Array.isArray(data) ||
    !data.every(
      (product) =>
        product.id &&
        product.title &&
        product.price &&
        product.images.length > 0
    )
  ) {
    throw new Error('Invalid data format');
  }

     // Adding a default quantity to each product
    return data.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      imageUrl: product.images[0], // Use the first image in the images array
      quantity: 1, // Set default quantity to 1
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Function to fetch a single product by ID
export const fetchProductDetails = async (id: string): Promise<ProductsType> => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched products detail:', data); 

     // Ensure that the response contains valid product data
     if (
      !data.id ||
       !data.title ||
        !data.price ||
         !data.images) {
      console.log("data", data)
      throw new Error('Invalid product data format');
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      quantity: 1, // Set default quantity to 1
      imageUrl: data.images[0], // Use imageUrl as per your interface
    };
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};



  // Function to register a new user
  export async function apiRegister(data: RegisterData): Promise<AuthResponse> {
    try{
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(response);
  }catch (error) {
    await handleApiError(error);
    throw error;
  }
}
  

  // Function to log in a user
  export async function apiLogin(credentials: LoginCredentials): Promise<AuthResponse> {
   try{
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse<AuthResponse>(response);
  }catch (error) {
    await handleApiError(error);
    throw error;
  }
}
  
 
  
  // // Function to fetch a category by ID or all categories
  // export async function getCategory(id?: string): Promise<Category | Category[]> {
  //   try {
  //     const url = id ? `${BASE_URL}/categories/${id}` : `${BASE_URL}/categories`;
  //     const response = await fetch(url);
  //     return await handleResponse<Category | Category[]>(response);
  //   } catch (error) {
  //     await handleApiError(error);
  //     throw error;
  //   }
  // }

//   // Fetch products for a specific category with a limit
// export const fetchProductsByCategory = async (categoryId: number | string, limit: number) => {
//   try {
//     const res = await fetch(`/api/products?categoryId=${categoryId}&limit=${limit}`);
//     if (!res.ok) {
//       throw new Error('Failed to fetch products');
//     }
//     const data = await res.json();
//     return data.products; // Assuming the API returns products as { products: [...] }
//   } catch (error) {
//     throw new Error('Error fetching products by category');
//   }
// };


  // Function to fetch homepage data
// export async function getHomePageData(): Promise<HomePageData> {
//     const response = await fetch(`${BASE_URL}/home`);
//     return handleResponse<HomePageData>(response);
//   }
  
  // Function to complete checkout
//   export async function checkout(data: CheckoutFormData): Promise<Order> {
//     try{
//     const token = localStorage.getItem("token");
//     if (!token) {
//       throw new ApiError(401, "Unauthorized: No token found");
//     }
  
//     const response = await fetch(`${BASE_URL}/checkout`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(data),
//     });
//     return handleResponse<Order>(response);
//   } catch (error) {
//     await handleApiError(error);
//     throw error;
//   }
// }