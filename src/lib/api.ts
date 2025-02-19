

import {  
      ProductsType,   
      CategoryType,
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

// Helper function to validate product data
export const validateProductData = (product: any): boolean => {
  return (
    product.id !== undefined &&
    product.id !== null &&
    product.id !== "" &&
    product.title &&
    product.price &&
    Array.isArray(product.images) &&
    product.images.length > 0 &&
    product.category
  );
};

//--------------------------------------------------
// Function to fetch all products
export const fetchProducts = async (
  categoryId?: string | number,
  baseUrl: string = BASE_URL // Allow overriding the base URL
): Promise<ProductsType[]> => {
  try {
    // Build the URL
    const url = categoryId
      ? `${baseUrl}/products/?categoryId=${categoryId}`
      : `${baseUrl}/products`;

    // Fetch data
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Validate the response
    if (!Array.isArray(data) || !data.every(validateProductData)) {
      throw new Error("Invalid data format");
    }

    // Map the data to the ProductsType interface
    const mappedProducts: ProductsType[] = data.map((product) => ({
      id: product.id.toString(),
      title: product.title,
      description: product.description,
      price: product.price,
      imageUrl: product.images[0], // Use the first image
      quantity: 1, // Default quantity
      category: {
        id: product.category.id,
        name: product.category.name,
      },
    }));

    return mappedProducts;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error("Failed to fetch products");
  }
};




//-------------------------------------------
// Function to fetch a single product by ID
export const fetchProductDetails = async (
  id: string | number,
  baseUrl: string = BASE_URL // Allow overriding the base URL
): Promise<ProductsType> => {
  try {
  
    // Fetch data
    const response = await fetch(`${baseUrl}/products/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        console.error(`Product with ID ${id} not found.`);
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Validate the response
    if (!validateProductData(data)) {
      console.error("Invalid product data format:", data);
      throw new Error("Invalid product data format");
    }

    // Map the data to the ProductsType interface
    const product: ProductsType = {
      id: data.id.toString(),
      title: data.title,
      description: data.description || "",
      price: data.price,
      quantity: 1, // Default quantity
      imageUrl: data.images[0], // Use the first image
      category: {
        id: data.category.id,
        name: data.category.name,
        description: data.category.description || "",
        image: data.category.image || "",
      },
    };

    return product;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error("Failed to fetch products");
  }
};


//----------------------------------------------
// Function to fetch products by category
export const fetchProductsByCategory = async (
  categoryId: string | number, // Category ID to fetch products for
  baseUrl: string = BASE_URL // Allow overriding the base URL
): Promise<ProductsType[]> => {
  try {
    // Build the URL for fetching products by category ID
    const url = `${baseUrl}/products/?categoryId=${categoryId}`;

    // Fetch data
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Validate the response
    if (!Array.isArray(data) || !data.every(validateProductData)) {
      throw new Error("Invalid data format");
    }

    // Map the data to the ProductsType interface
    const mappedProducts: ProductsType[] = data.map((product) => ({
      id: product.id.toString(),
      title: product.title,
      description: product.description,
      price: product.price,
      imageUrl: product.images[0], // Use the first image
      quantity: 1, // Default quantity
      category: {
        id: product.category.id,
        name: product.category.name,
      },
    }));

    return mappedProducts;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error("Failed to fetch products by category");
  }
};




//-------------------------------------------
export const fetchCategories = async (
  baseUrl: string = BASE_URL // Allow overriding the base URL
): Promise<CategoryType[]> => {
  try {
    // Fetch categories data
    const response = await fetch(`${baseUrl}/categories`);
    console.log('Fetching categories from:', `${baseUrl}/categories`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched data:', data);
    // Validate the response if needed (e.g., check if data is an array)
    if (!Array.isArray(data)) {
      console.error("Invalid categories data format:", data);
      throw new Error("Invalid categories data format");
    }

    // Map the data to CategoryType interface if necessary (you can skip this if it's already correct)
    const categories: CategoryType[] = data.map((item: any) => ({
      id: item.id.toString(),
      name: item.name,
    }));
 console.log('Mapped Categories:', categories); 
    return categories;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error("Failed to fetch categories");
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