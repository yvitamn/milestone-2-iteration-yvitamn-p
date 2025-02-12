'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link'; 
import { fetchProducts } from '@/lib/api';
import { ProductsType } from '@/lib/types';  
import { GetStaticProps } from 'next';


// interface HomePageProps {
//   productsHomePage: ProductsType[];
// }

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


const HomePage: React.FC = () => {
  const [productsHome, setProductsHome] = useState<ProductsType[]>([]); // Products state
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  
  
  useEffect(() => {
    // Use the existing fetchProducts function from your lib folder
    const fetchProductsHomeAll = async () => {
      setIsLoading(true);
      try {
        const products = await fetchProducts();  // Call your fetchProducts from lib
        setProductsHome(products);  // Update the state with the fetched products
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductsHomeAll();  // Call the function on component mount
  }, []); 

  
  return (
    <div className="container mx-auto p-6">
  

{isLoading ? (
  <div className="text-center">Loading...</div>
) : error ? (
  <div className="text-center text-red-600">{error}</div>
) : productsHome.length === 0 ? (
  <div className="text-center">No products available</div>
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
    {productsHome.slice(0, 15).map((product) => (
      <div
        key={product.id}
        className="w-96 flex-shrink-0 p-4 border rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out"
      >
        {/* Product Image and Title */}
        <Link href={`/products/${product.id}`} className="block">
          <img
            src={product.imageUrl} // Directly use the imageUrl provided by the fetchProducts function
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