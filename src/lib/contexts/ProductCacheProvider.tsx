import { createContext, useContext, useState } from 'react';
import { fetchProducts } from '@/lib/productApi';
import { Product } from '@/lib/types';

const ProductCacheContext = createContext<{
  products: Product[];
  fetchProducts: () => Promise<void>;
}>({
  products: [],
  fetchProducts: async () => {},
});

export function ProductCacheProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = async () => {
    const { products } = await fetchProducts();
    setProducts(products);
  };

  return (
    <ProductCacheContext.Provider value={{ products, fetchProducts: loadProducts }}>
      {children}
    </ProductCacheContext.Provider>
  );
}

export function useProductCache() {
  return useContext(ProductCacheContext);
}

