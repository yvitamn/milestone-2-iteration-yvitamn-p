import { useMemo } from 'react';
import { ProductsType, Category } from '@/lib/types';

interface MemoizedProductsParams {
  products: ProductsType[];
  categories: Category[];
  selectedCategory: string | string[] | null;
  itemsPerPage: number;
  currentPage: number;
}

export const useMemoizedProducts = ({
  products,
  categories,
  selectedCategory,
  itemsPerPage,
  currentPage,
}: MemoizedProductsParams) => {

  // Memoize filtered products based on selected category
  const memoizedFilteredProducts = useMemo(() => {
    let productsToFilter = products;
    if (selectedCategory === '') {
      return productsToFilter; // Show all products if no category is selected
    }
    return productsToFilter.filter((product) => {
      return product.category && product.category.id === parseInt(String(selectedCategory));
    });
  }, [products, selectedCategory]);

  // Memoize total pages for pagination
  const memoizedTotalPages = useMemo(() => {
    return Math.ceil(memoizedFilteredProducts.length / itemsPerPage);
  }, [memoizedFilteredProducts, itemsPerPage]);

  // Memoize the displayed products based on pagination
  const memoizedDisplayedProducts = useMemo(() => {
    return memoizedFilteredProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [memoizedFilteredProducts, currentPage, itemsPerPage]);

  // Memoize categories list (could be sorted or transformed)
  const memoizedCategories = useMemo(() => {
    return categories.sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  return {
    memoizedFilteredProducts,
    memoizedTotalPages,
    memoizedDisplayedProducts,
    memoizedCategories,
  };
};
