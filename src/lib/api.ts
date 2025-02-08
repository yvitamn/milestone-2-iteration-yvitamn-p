import {  
      ProductsType,   
      Category,
      AuthResponse,
      LoginCredentials,
      RegisterData,    
    } from '@/lib/types';

// Base URL for the API
const BASE_URL = "https://api.escuelajs.co/api/v1";

// Cache for storing fetched products (simple in-memory cache)
const productsCache: Record<string, ProductsType[]> = {};


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


// Function to fetch all products with pagination support
export const fetchProducts = async (
  page: number = 1, // Default to page 1
  limit: number = 10, // Default to 10 items per page
): Promise<{ products: ProductsType[]; total: number }> => {
  const cacheKey = `products-page-${page}-limit-${limit}`;

  // Check if the data is already cached
  if (productsCache[cacheKey]) {
    console.log("Returning cached products");
    return { products: productsCache[cacheKey], 
        total: productsCache[cacheKey].length };
  }

  try {
    const response = 
    await fetch(`${BASE_URL}/products?offset=${(page - 1) 
    * limit}&limit=${limit}`);

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Failed to fetch products. Status: ${response.status}`);
    }

    const data: ProductsType[] = await response.json();

    // Ensure that the response is an array and has the necessary properties
    if (
      !Array.isArray(data) ||
      !data.every(
        (product) =>
          product.id &&
          product.title &&
          product.price &&
          product.images.length > 0 &&
          product.category
        )
    ) {
      throw new Error('Invalid data format: Expected an array of products');
    }

    // Map the API response to the frontend Product interface
    const products: ProductsType[] = data.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      images: Array.isArray(product.images) ? product.images : [product.images], // Use the first image in the images array
      quantity: 1, // Default quantity (can be overridden dynamically)
      category: {
        id: product.category.id,
        name: product.category.name,
        description: product.category.description || '', //optional
        image: product.category.image || '', //optional
      },
    }));

    // Cache the fetched products
    productsCache[cacheKey] = products;

     // Get the total number of products from the API response
    const total = Number(
        response.headers.get('X-Total-Count')) || products.length;


    return { products, total };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Function to fetch a single product by ID with caching
export const fetchProductDetails = async (
  id: number,
  quantity: number = 1, // Defaul)
): Promise<ProductsType> => {
  const cacheKey = `product-${id}`;

  // Check if the product is already cached
  if (productsCache[cacheKey]) {
    console.log("Returning cached product");
    return productsCache[cacheKey][0]; // Return the first (and only) product in the cache
  }

  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch product details. Status: ${response.status}`);
    }

    const data: ProductsType = await response.json();

    // Ensure that the response contains valid product data
    if (!data.id || !data.title || !data.price || !data.images || !data.category) {
      throw new Error('Invalid product data format');
    }

    // Map the API response to the frontend Product interface
    const product: ProductsType = {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      quantity, // Use the provided quantity (or default to 1)
      images: data.images, // Use the first image in the images array
      category: {
        id: data.category.id,
        name: data.category.name,
      //  description: data.category.description || '', //optional
        image: data.category.image || '', //optional
      },
    };

    // Cache the fetched product
    productsCache[cacheKey] = [product];

    return product;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};


  
  // Function to register a new user
  export async function register(data: RegisterData): Promise<AuthResponse> {
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
  export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
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
  
 
  
  // Function to fetch statistics
  // export async function getStats(): Promise<{ totalProducts: number; totalOrders: number; totalRevenue: number }> {
  //   try {
  //     const response = await fetch(`${BASE_URL}/stats`);
  //     return await handleResponse<{ totalProducts: number; totalOrders: number; totalRevenue: number }>(response);
  //   } catch (error) {
  //     await handleApiError(error);
  //     throw error;
  //   }
  // }
  
  // Function to fetch a category by ID or all categories
  export async function getCategory(id?: string): Promise<Category | Category[]> {
    try {
      const url = id ? `${BASE_URL}/categories/${id}` : `${BASE_URL}/categories`;
      const response = await fetch(url);
      return await handleResponse<Category | Category[]>(response);
    } catch (error) {
      await handleApiError(error);
      throw error;
    }
  }

  // Fetch products for a specific category with a limit
export const fetchProductsByCategory = async (categoryId: number | string, limit: number) => {
  try {
    const res = await fetch(`/api/products?categoryId=${categoryId}&limit=${limit}`);
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await res.json();
    return data.products; // Assuming the API returns products as { products: [...] }
  } catch (error) {
    throw new Error('Error fetching products by category');
  }
};


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