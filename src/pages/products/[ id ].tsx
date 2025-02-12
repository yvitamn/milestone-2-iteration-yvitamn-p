'use client';
import Image from 'next/image'
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchProductDetails, fetchProducts } from '@/lib/api'; // Fetch single product by ID
import { ProductsType } from '@/lib/types';
import { useCart } from '@/hooks/useCart';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


interface ProductDetailProps {
    onAddToCart: () => void;
    product: ProductsType; 
  }

// This will fetch all product IDs during build time
export const getStaticPaths: GetStaticPaths = async () => {
    try {
      const products = await fetchProducts();
      console.log('Products fetched in getStaticPaths:', products); // Debugging

      if (!Array.isArray(products)) {
        throw new Error('Products data is not an array');
      }
      
      const paths = products.map((product) => ({
        params: { id: product.id.toString() },
      }));
      console.log('Generated paths:', paths); 
  
      return {
        paths,
        fallback: 'blocking', // Can be 'true', 'false', or 'blocking'
      };
    } catch (error) {
      console.error('Error fetching product paths:', error);
      return { paths: [], fallback: 'blocking' };
    }
  };
  
  // Fetch the product details at build time
  export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { id } = params || {};  // Get the ID parameter
    console.log('Params in getStaticProps:', params);
    if (!id || typeof id !== 'string') {
        console.error('Invalid or missing ID:', id);
        return { notFound: true };
      }
      console.log('ID in getStaticProps:', id);
       
      try {
        const product = await fetchProductDetails(id.toString()); // Fetch product details by ID
        //console.log('Product fetched in getStaticProps:', product);
        if (!product) {
            console.error('Product not found for ID:', id); 
          return {
            notFound: true, // Return 404 if product is not found
          };
        }
  
    return {
      props: {
        product,
      },
      revalidate: 60, // Enable Incremental Static Regeneration (ISR) every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching product details:', error);
    return {
      notFound: true, // Return 404 if there's an error
    };
  }
};



const ProductDetailPage = ({ product, onAddToCart }: ProductDetailProps) => {
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const { addProductToCart } = useCart();
    const [error, setError] = useState<string | null>(null);
   const router = useRouter();

   if (router.isFallback) {
    return <div>Loading...</div>;
}
    // If product is not found, show error message
  useEffect(() => {
    if (!product) {
      setError('Product not found');
    }
  }, [product]);

  // Handler to add product to cart and open the modal
 // Function to handle "Add to Cart" action
  const handleAddToCart = () => {
    setIsAdding(true); // Set loading state
    // Simulate an async operation (e.g., API call)
    setTimeout(() => {
      setIsAdding(false); // Reset loading state
      onAddToCart();
    }, 1000);
  };
  

  
    if (!product) {
      return <div>Product not found</div>;
    }

    if (error) {
        return <div>{error}</div>;
      }

    return (
        <div className="container mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()} // Navigate to the previous page
          className="mb-6 bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600"
        >
          Back
        </button>
  
        {/* Product Title */}
        <h2 className="text-4xl font-bold mb-6">{product.title}</h2>
  
        {/* Product Image */}
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={500}
          height={400}
          className="rounded-lg mb-4"
        />
  
        {/* Product Description */}
        <p className="text-lg mb-4">{product.description}</p>
  
        {/* Product Price */}
        <p className="text-xl font-semibold mb-4">${product.price}</p>
  
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding} // Disable if product is not loaded
          className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          aria-label="Add to Cart"
          role="button"
          tabIndex={0}
        >
          {isAdding ? 'Adding...' : 'Add to Cart'} {/* Display "Adding..." when loading */}
        </button>
      </div>
    );
  };

export default ProductDetailPage;
