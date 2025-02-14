'use client';
import Image from 'next/image'
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchProductDetails, fetchProducts } from '@/lib/api';
import { ProductsType, Params } from '@/lib/types';
import { useCart } from '@/hooks/useCart';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


interface ProductDetailProps {
  onAddToCart?: () => void;
    product: ProductsType;

  }
  
   
  // This will fetch all product IDs during build time
export const getStaticPaths: GetStaticPaths<Params> = async () => {
    try {
      const products = await fetchProducts();
      console.log('Products fetched in getStaticPaths:', products); // Debugging

      if (!Array.isArray(products)) {
        throw new Error('Products data is not an array');
      }
      
      // Generate paths for each product (ensure id is a string)
      const paths = products.map((product) => ({
        params: { id: product.id.toString(). categoryId: product.category.id.toString()  }, // Ensure id is a string
      }));
      console.log('Generated paths:', paths);
  
      return {
        paths,
        fallback: 'blocking', 
      };
    } catch (error) {
      console.error('Error fetching product paths:', error);
      return { paths: [], fallback: 'blocking' };
    }
  };
  
  export const getStaticProps: GetStaticProps<ProductDetailProps, Params> = async ({params}) => {
    const { id, categoryId } = params as { id: string; categoryId: string };
  
    console.log('Fetching product for ID:', id, 'and CategoryId', categoryId);
  
    try {
       // Fetch products by category if categoryId is available
    const products = await fetchProducts(categoryId);  // Fetch products by category if categoryId exists
    const product = products.find((p) => p.id.toString() === id);
      
      console.log('Product fetched in getStaticProps:', product);
  
      if (!product) {
        return {
          notFound: true, // Return 404 if product is not found
        };
      } 
      return {
        props: {
          product,
          onAddToCart: () => {
            console.log('Product added to cart!');
          }, // Pass product data to the page
        },
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      return {
        notFound: true, // Return 404 if there's an error
      };
        }
  };


const ProductDetailPage: React.FC<ProductDetailProps> = ({ onAddToCart, product }) => {
    
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const { addProductToCart } = useCart();
    const [error, setError] = useState<string | null>(null);
   const router = useRouter();
   const { id, categoryId } = router.query;

   if (router.isFallback) {
    return <div>Loading...</div>;
}
if (!id || !categoryId) {
    return <div>Product or Category not found</div>;
  }
    // If product is not found, show error message
  useEffect(() => {
    if (!product) {
      setError('Product not found');
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (product) {
      setIsAdding(true); // Set loading state to true before adding
      try {
        await addProductToCart(product);  // Assuming `addProductToCart` might be an async function
        setIsAdding(false);  // Set loading state to false once product is added
  
        // Use setTimeout to delay the execution of onAddToCart
        setTimeout(() => {
            if (onAddToCart) { // Ensure onAddToCart is defined before calling it
                onAddToCart();  // Trigger the modal to show after a delay
              }
            }, 2000); // Delay of 2000 milliseconds (2 seconds)
      
          } catch (error) {
            console.error("Error adding product to cart:", error);
            setIsAdding(false); // Set loading state to false even if there's an error
          }
        }
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
