'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link'; 
import { fetchProducts as fetchProductsFromAPI } from '@/lib/api';
import { ProductsType } from '@/lib/types';  
import { GetStaticProps } from 'next';

interface HomePageProps {
  product: ProductsType[]; 
}


// export const getStaticPaths: GetStaticPaths = async () => {
//   let products: ProductsType[] = [];
//   try {
//     products = await fetchProductsFromAPI(); // Fetch all products
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     products = []; // Ensure an empty array if the fetch fails
//   }

//   // Generate the paths for each product ID
//   const paths = products.map((product) => ({
//     params: { id: product.id.toString() }, // Ensure that the id is a string
//   }));

//   return {
//     paths,
//     fallback: 'blocking', // or 'false' depending on your needs
//   };
// };

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params || {};  // Get the ID parameter
  let product = null ;

  try {
    const allProducts = await fetchProductsFromAPI();
    product = allProducts.find((prod) => prod.id.toString() === id) || null; // Find the product by ID
  } catch (error) {
    console.error('Error fetching the product:', error);
    product = null;
  }

  // Ensure product is not undefined
  if (product === undefined) {
    product = null;
  }
  return {
    props: {
      product,
    },
  };
};


const HomePage = ({ product }: HomePageProps) => {
  const [productsHome, setProductsHome] = useState<ProductsType[]>([]); // Products state
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [visibleProducts, setVisibleProducts] = useState<ProductsType[]>([]); //slice
  
  const sliceProducts = (allProducts: ProductsType[], startIndex: number, endIndex: number) => {
    return allProducts.slice(startIndex, endIndex);
  }

     // If product is not found, show error message
     useEffect(() => {
      if (!product) {
        setError('Product not found');
        setIsLoading(false);  
        return;     
      }
      //add single product if needed
      setProductsHome([product]);
      setIsLoading(false); 
    }, [product]);

  // Slice and paginate products for scrollable grid
  const handleScroll = (event: React.UIEvent) => {
    const grid = event.target as HTMLElement;
    const rightEnd = grid.scrollWidth === grid.scrollLeft + grid.clientWidth;

    if (rightEnd && !isLoading && visibleProducts.length < productsHome.length) {
      setIsLoading(true);


      // For example, loading the next 10 products on scroll
      const newProducts = sliceProducts(productsHome, visibleProducts.length, visibleProducts.length + 10);
      setVisibleProducts((prev) => [...prev, ...newProducts]);

      setIsLoading(false);
    }
  };

  // Initialize the visible products with the first 15
  useEffect(() => {
    if (productsHome.length) {
      setVisibleProducts(sliceProducts(productsHome, 0, 15));
    }
  }, [productsHome]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Product Page</h1>

      {productsHome.length > 0 && (
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-gray-700">{productsHome[0].title}</h2>
          <p className="text-lg text-gray-600 mt-2">{productsHome[0].description}</p>
          <p className="text-xl font-bold text-green-600 mt-2">${productsHome[0].price}</p>
        </div>
      )}

      {/* Scrollable grid for products */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-auto py-4"
        onScroll={handleScroll}
        style={{
          maxHeight: '400px',
        }}
      >
        {visibleProducts.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <div
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-gray-800">{product.title}</h3>
              <p className="text-gray-600 mt-2">{product.description}</p>
              <p className="text-xl font-bold text-green-600 mt-4">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;