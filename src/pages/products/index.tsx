//import { GetStaticProps } from 'next';
import { fetchProducts } from '@/lib/api'; // Fetch products from the API
import { ProductsType } from '@/lib/types';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';

interface ProductsPageProps {
  productsListPage: ProductsType[];
}

export const getStaticProps: GetStaticProps = async () => {
  let products: ProductsType[] = [];
  try {
    products = await fetchProducts(); // Fetch all products
  } catch (error) {
    console.error('Error fetching products:', error);
    products =[];
  }

  return {
    props: {
      products,
    },
    revalidate: 3600,
  };
};

const ProductsPage: React.FC<ProductsPageProps> = ({ productsListPage }) => {
  const [productState, setProductState] = useState<ProductsType[]>([]); // Products state
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  if (!productsListPage || productsListPage.length === 0) {
    return <div>No products available.</div>; // Show a fallback message if no products
  }

  // Set the products to productState when component is mounted
  useEffect(() => {
    setProductState(productsListPage || []);
    setIsLoading(false);
  }, [productsListPage]);




  return (
    <div className="container mx-auto p-6">
       {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(productsListPage || []).map((product) => (
          <div
            key={product.id}
            className="col-span-1 p-4 border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
          >
            {/* Product Image and Title */}
            <Link href={`/products/${product.id}`} className="block">
              <img
            src={product.imageUrl}
            alt={product.title}
            
             className="w-full h-auto aspect-square object-cover mb-4 rounded"
          />
        </Link>
        <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
        <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
          </div>
        ))}
      </div>
      )}
   </div>   
  )
}; 

export default ProductsPage;
