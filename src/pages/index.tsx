'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link'; 
import { fetchProducts } from '@/lib/api';
import { ProductsType } from '@/lib/types';  
import { GetStaticProps } from 'next';


interface HomePageProps {
  productsHomePage: ProductsType[];
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


const HomePage: React.FC<HomePageProps> = ({ productsHomePage }) => {
  const [productState, setProductState] = useState<ProductsType[]>([]); // Products state
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  
  const products = productsHomePage || [];
  

  if (!productsHomePage || productsHomePage.length === 0) {
    return <div>No products available.</div>; // Show a fallback message if no products
  }
  // Set the products to productState when component is mounted
  useEffect(() => {
    setProductState(productsHomePage || []);
    setIsLoading(false);
  }, [productsHomePage]);

  
  return (
    <div className="container mx-auto p-6">
  

      {isLoading ? (
  <div className="text-center">Loading...</div>
) : error ? (
  <div className="text-center text-red-600">{error}</div>
) : (

<div className="relative"> {/* Parent container for positioning buttons */}
    {/* Scroll Left Button */}
    <button
      onClick={() => {
        const productGrid = document.getElementById('product-grid');
        if (productGrid) {
          productGrid.scrollBy({ left: -200, behavior: 'smooth' });
        }
      }}
      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10"
    >
      &larr;
    </button>

    {/* Scrollable Product Grid */}
    <div id="product-grid" className="overflow-x-auto whitespace-nowrap scroll-smooth max-w-screen-lg mx-auto">
      <div className="inline-flex gap-6 p-4">
        {products.slice(0, 15).map((product) => (
          <div
            key={product.id}
            className="w-96 
            flex-shrink-0 
            p-4 border 
            rounded-lg 
            shadow-lg 
            hover:shadow-xl 
            transition-all 
            duration-500 
            ease-in-out"
          >
            {/* Product Image and Title */}
            <Link href={`/products/${product.id}`} className="block">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-128 object-cover mb-4 rounded"
              />
             
            </Link>
          </div>
        ))}
      </div>
    </div>

    {/* Scroll Right Button */}
    <button
      onClick={() => {
        const productGrid = document.getElementById('product-grid');
        if (productGrid) {
          productGrid.scrollBy({ left: 200, behavior: 'smooth' });
        }
      }}
      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10"
    >
      &rarr;
    </button>
  </div>
)}

         </div>   
  );
};

export default HomePage;