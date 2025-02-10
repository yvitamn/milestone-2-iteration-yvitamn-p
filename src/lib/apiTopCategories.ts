
import { ProductsType, CategoryTopCategories, Category } from '@/lib/types';
import { ApiError, handleResponse } from '@/lib/api';

const BASE_URL = "https://api.escuelajs.co/api/v1";


// Cache for products fetched by category
const productsCache: Record<string, ProductsType[]> = {};

// Fetch top categories with their products (limited to 20 per category)
export const fetchTopCategoriesWithProducts = async (limit: number = 20): Promise<Category[]> => {
  const cacheKey = `top-categories-with-products-${limit}`;

  // Check if top categories are cached
  if (localStorage.getItem(cacheKey)) {
    console.log("Returning cached top categories with products");
    const cachedData = localStorage.getItem(cacheKey);
    return cachedData ? JSON.parse(cachedData) : [];
  }

  try {
    const response = await fetch(`${BASE_URL}/categories?limit=4`);
    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to fetch top categories');
    }

    const categories: Category[] = await handleResponse<Category[]>(response);

    // Fetch products for each category and add to category
    const categoriesWithProducts: CategoryTopCategories[] = await Promise.all(
        categories.map(async (category) => {
          // Fetch products for each category
          const products = await fetchProductsByCategoryWithLimit(category.id, limit);
          
          // Create a new object with the products field added to the category
          const categoryWithProducts: CategoryTopCategories = {
            ...category,  // Spread the original category properties
            products: products,  // Add the products to this category
          };
          return categoryWithProducts;
        })
      );
  
      // Cache the top categories with products
      localStorage.setItem(cacheKey, JSON.stringify(categoriesWithProducts));
  
      return categoriesWithProducts;
  } catch (error) {
    console.error('Error fetching top categories with products:', error);
    throw error;
  }
};

// Fetch products by category (with limit) for the new API
const fetchProductsByCategoryWithLimit = async (categoryId: number | string, limit: number): Promise<ProductsType[]> => {
  const cacheKey = `products-by-category-${categoryId}-limit-${limit}`;

  // Check if category products are cached
  if (productsCache[cacheKey]) {
    console.log("Returning cached products for category", categoryId);
    return productsCache[cacheKey];
  }

  try {
    const response = await fetch(`${BASE_URL}/products?categoryId=${categoryId}&limit=${limit}`);
    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to fetch products by category');
    }

    const products: ProductsType[] = await handleResponse<ProductsType[]>(response);

    // Cache the category products
    productsCache[cacheKey] = products;
    return products;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};