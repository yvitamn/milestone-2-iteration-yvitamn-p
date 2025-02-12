'use client';

import { fetchProducts} from '@/lib/api'; // Fetch products from the API
import { ProductsType } from '@/lib/types';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';


interface ProductsPageProps {
  product: ProductsType[];
}

export const getStaticProps: GetStaticProps = async () => {
 
  let product: ProductsType[] = [];
  try {
    // Fetch all products
    product = await fetchProducts();  // This will return an array of all products
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return {
    props: {
      product,  // Pass the products array as props to the page
    },
    revalidate: 60,  // Optional: If you want Incremental Static Regeneration every 60 seconds
  };
};

const ProductsPage = ({ product }: ProductsPageProps) => {
  const [productsList, setProductsList] = useState<ProductsType[]>([]); // Products state
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // If product is not found, show error message
  useEffect(() => {
    if (!product || product.length === 0) {
      setError('Product not found');
      setIsLoading(false);  
      return;     
    }
    //add single product if needed
    setProductsList(product);
    setIsLoading(false); 
  }, [product]);



  return (
    <div className="container">
    {isLoading ? (
      <div className="text-center py-10 text-xl">Loading...</div>
    ) : error ? (
      <div className="text-center text-red-600 py-10 text-xl">{error}</div>
    ) : productsList.length === 0 ? (
      <div className="text-center py-10 text-xl">No products available</div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {productsList.map((product) => (
          <div
            key={product.id}
            className="product-card col-span-1 p-4 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
          >
            <Link href={`/products/${product.id}`} passHref>
              <div className="cursor-pointer">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  width={500}
                  height={400}
                  className="rounded-lg"
                  // className="product-image h-64 object-cover rounded-lg mb-4 shadow-md"
                />
                <div className="p-4">
                  <h2 className="product-title text-2xl font-semibold text-gray-800 mb-2">{product.title}</h2>
                  {/* <p className="product-description text-gray-600 text-sm line-clamp-3">{product.description}</p> */}
                  <p className="product-price mt-4 text-lg font-bold text-green-500">${product.price}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    )}
  </div>
);
};


export default ProductsPage;
