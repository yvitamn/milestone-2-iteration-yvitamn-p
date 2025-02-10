import { useState, useEffect, useMemo } from 'react';
import { 
    productCache,
    productsCache,
    fetchCategories, 
    fetchTopCategories, 
    fetchProductsByCategory, 
    fetchProductWithCategory, 
    fetchProductDetails } from '@/lib/api'; // Import your new fetch function
import { Category, ProductsType } from '@/lib/types'; 


const categoryCache: Record<string, Category[] | null> = {}; // Cache for categories
const topCategoriesCache: Category[] | null = null; // Cache for top categories

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// Define the return type based on the 'type' param
type UseCategoriesReturnType<T> = 
  T extends 'all' | 'top' ? Category[] : // If type is 'all' or 'top', expect Category[] 
  T extends 'byCategory' ? ProductsType[] : // If type is 'byCategory', expect ProductsType[]
  T extends 'singleProduct' | 'singleProductNoncategory' ? ProductsType : // If type is 'singleProduct' or 'singleProductNoncategory', expect a single ProductsType
  never;

export const useCategories = (
  type: 'all' | 'top' | 'byCategory' | 'singleProduct' | 'singleProductNoncategory' = 'all', 
  categoryId?: string, 
  productId?: string
) => {
  const [state, setState] = useState<FetchState<UseCategoriesReturnType<typeof type>>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState((prevState) => ({ ...prevState, loading: true, error: null }));

        let data;

        // Check cache before fetching
        if (type === 'all' && categoryCache['all-categories']) {
          data = categoryCache['all-categories'];
        } else if (type === 'top' && topCategoriesCache) {
          data = topCategoriesCache;
        } else if (type === 'byCategory' && categoryId) {
          // Check cache for category-based products
          const cacheKey = `products-by-category-${categoryId}`;
          if (productsCache[cacheKey]) {
            data = productsCache[cacheKey];
          }
        } else if (type === 'singleProduct' && productId) {
          const cacheKey = `product-${productId}`;
          if (productCache[cacheKey]) {
            data = productCache[cacheKey];
          }
        } else if (type === 'singleProductNoncategory' && productId) {
          const cacheKey = `product-${productId}`;
          if (productCache[cacheKey]) {
            data = productCache[cacheKey];
          }
        }

        // Fetch based on type
        if (type === 'all') {
          data = await fetchCategories();
        } else if (type === 'top') {
          data = await fetchTopCategories();
        } else if (type === 'byCategory' && categoryId) {
          data = await fetchProductsByCategory(Number(categoryId));
        } else if (type === 'singleProduct' && productId) {
          data = await fetchProductWithCategory(Number(productId));
        } else if (type === 'singleProductNoncategory' && productId) {
          data = await fetchProductDetails(Number(productId)); // This fetches a product without a category
        } else {
          throw new Error('Invalid parameters');
        }

        setState({ data, loading: false, error: null });
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    };

    fetchData();
  }, [type, categoryId, productId]); // Dependency array ensures the hook fetches data when the type or id changes

  // Memoizing data based on the type fetched
  const memoizedData = useMemo(() => {
    if (type === 'all' || type === 'top') {
      return state.data as Category[]; // Memoize categories
    }
    if (type === 'byCategory' || type === 'singleProduct' || type === 'singleProductNoncategory') {
      return state.data as ProductsType[]; // Memoize products
    }
    return state.data;
  }, [state.data, type]);

  return { ...state, data: memoizedData }; // Return memoized data, loading, and error state
};