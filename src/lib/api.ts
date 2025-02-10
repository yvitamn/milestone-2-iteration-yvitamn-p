import {  
      ProductsType,   
      Category,
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
// Cache for storing fetched products (simple in-memory cache)
const productsCache: Record<string, ProductsType[]> = {};
const categoryCache: Record<string, Category[] | null> = {};
let topCategoriesCache: Category[] | null = null;
const productCache: Record<string, ProductsType> = {}; 



// Function to fetch all products with no pagination support
export const fetchProducts = async (): Promise<ProductsType[]> => {
  const cacheKey = 'all-products';

  // Check if data is cached
  if (productsCache[cacheKey]) {
    console.log("Returning cached products");
    return productsCache[cacheKey];
  }

  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to fetch products');
    }

    const data: ProductsType[] = await handleResponse<ProductsType[]>(response);

    // Validate data
    if (!Array.isArray(data) || !data.every(product => product.id && product.title && product.price)) {
      throw new Error('Invalid product data format');
    }

    // Map data to ProductsType
    const products: ProductsType[] = data.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      images: Array.isArray(product.images) ? product.images : [product.images],
      quantity: 1, 
      category: {
        id: product.category.id || 0,
        name: product.category.name || 'Unknown',
        description: product.category.description || '',
        image: product.category.image || '',
      },
    }));

    // Cache the fetched products
    productsCache[cacheKey] = products;

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw handleApiError(error);
  }
};




//-----------------------------------------------------

// Function to fetch a single product id without category
export const fetchProductDetails = async (id: number): Promise<ProductsType> => {
  const cacheKey = `product-${id}`;

  // Check if the product is already cached
  if (productCache[cacheKey]) {
    console.log("Returning cached product");
    return productCache[cacheKey]; // Return the cached product directly
  }

  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch product details. Status: ${response.status}`);
    }

    const data: ProductsType = await response.json();

    // Ensure the response contains valid product data
    if (!data.id || !data.title || !data.price || !data.images || !data.category) {
      throw new Error('Invalid product data format');
    }

    // Map the API response to the frontend Product interface
    const product: ProductsType = {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      quantity: 1, // Default quantity (could be passed in as a parameter if needed)
      images: Array.isArray(data.images) ? data.images : [data.images], // Ensure images are an array
      category: {} as Category,
    };

    // Cache the fetched product
    productCache[cacheKey] = product;

    return product;
  } catch (error) {
    console.error("Error fetching product details:", error);
    throw error;
  }
};




//------------------------------------------------------

// Fetch a single product with category id
export const fetchProductWithCategory = async (id: number): Promise<ProductsType> => {
  const cacheKey = `product-${id}`;

  // Check if product is cached
  if (productCache[cacheKey]) {
    console.log("Returning cached product");
    return productCache[cacheKey]; 
  }

  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to fetch product details');
    }

    const data: ProductsType = await handleResponse<ProductsType>(response);

    // Map product data
    const product: ProductsType = {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      images: data.images,
      quantity: 1, 
      category: {
        id: data.category?.id || 0, // Use data.category to extract category info
        name: data.category?.name || 'Unknown',
        description: data.category?.description || '',
        image: data.category?.image || '',
      },
    };

    // Cache the product
    productCache[cacheKey] = product;

    return product;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw handleApiError(error);
  }
};


//--------------------------------------------------------------
// Fetch all products by category (no pagination)
export const fetchProductsByCategory = async (categoryId: number | string): Promise<ProductsType[]> => {
  const cacheKey = `products-by-category-${categoryId}`;

  // Check if category products are cached
  if (productsCache[cacheKey]) {
    console.log("Returning cached products for category", categoryId);
    return productsCache[cacheKey];
  }

  try {
    const response = await fetch(`${BASE_URL}/products?categoryId=${categoryId}`);
    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to fetch products by category');
    }

    const data: ProductsType[] = await handleResponse<ProductsType[]>(response);

    // Map data to ProductsType
    const products: ProductsType[] = data.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      images: Array.isArray(product.images) ? product.images : [product.images],
      quantity: 1,
      category: {
        id: product.category.id || 0,
        name: product.category.name || 'Unknown',
        description: product.category.description || '',
        image: product.category.image || '',
      },
    }));

    // Cache the category products
    productsCache[cacheKey] = products;
    return products;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw handleApiError(error);
  }
};





//---------------------------------------------------
// Fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  const cacheKey = 'all-categories';

  // Check if categories are already cached
  if (categoryCache[cacheKey] !== null && categoryCache[cacheKey]) {
    console.log("Returning cached categories");
    return categoryCache[cacheKey];  // Returning cached categories array
  }

  try {
    const response = await fetch(`${BASE_URL}/categories`);
    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to fetch categories');
    }

  // Ensure handleResponse correctly processes the API response
  const data: Category[] = await handleResponse<Category[]>(response);

    // Cache the categories
    categoryCache[cacheKey] = data;

    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw handleApiError(error);
  }
};





//--------------------------------------------------------
// Fetch the top categories for the homepage
export const fetchTopCategories = async (): Promise<Category[]> => {
  const cacheKey = 'topCategories';

  // Check if top categories are cached
  if (topCategoriesCache) {
    console.log("Returning cached top categories");
    return topCategoriesCache;
  }

  try {
    const response = await fetch(`${BASE_URL}/categories?limit=4`);
    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to fetch top categories');
    }

    const categories: Category[] = await handleResponse<Category[]>(response);

    // Cache the top categories
    topCategoriesCache = categories;

    return categories;
  } catch (error: unknown) { // error is of type 'unknown'
    if (error instanceof ApiError) {
      console.error('Error fetching top categories for homepage:', error);
      throw error; // Re-throw the ApiError
    } else if (error instanceof Error) {
      // Handle other errors that might be instances of Error
      console.error('Unexpected error:', error.message);
      throw new ApiError(500, 'Unexpected error fetching top categories');
    } else {
      // Handle case where the error is of an unknown type
      console.error('Unknown error occurred');
      throw new ApiError(500, 'Unknown error occurred fetching top categories');
    }
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