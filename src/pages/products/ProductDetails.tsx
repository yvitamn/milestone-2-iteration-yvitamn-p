'use client';
import Image from 'next/image';
import Link from "next/link";
import { GetServerSideProps } from 'next';
import { CategoryType, ProductsType } from '@/lib/types';
import { useCart } from '@/hooks/useCart';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';


interface ProductDetailProps {
    onAddToCart?: () => void;
    product: ProductsType;
    category: CategoryType; 
  }
  
  
  export const getServerSideProps: GetServerSideProps<ProductDetailProps> = async (context) => {
    const { id } = context.params as { id: string }; // Ensure id is a string
    const productId = parseInt(id, 10);  //Parse the string id to a number
    
    if (isNaN(productId)) {
        return {
        notFound: true, // If the id is not a valid number, return a 404 page
        };
    }
    // Fetch product details
    const productRes = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`);
    const product = await productRes.json();
  
    // Fetch category details using the product's categoryId
    const categoryRes = await fetch(`https://api.escuelajs.co/api/v1/categories/${product.category.id}`);
    const category = await categoryRes.json();
  
    return {
      props: {
        product,
        category,
      },
    };
  };


const ProductDetailPage = ({ onAddToCart, product, category }: ProductDetailProps) => {   
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const { addProductToCart } = useCart();
   // const [error, setError] = useState<string | null>(null);
    const router = useRouter();
   //const { id } = router.query;

   if (router.isFallback) {
    return <div>Loading...</div>;
}
    

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
        {/* Product Price */}
        <p>
          <strong>Category</strong> {category.name}
        </p>
        <p className="text-xl font-semibold mb-4">${product.price}</p>
        {/* Product Description */}
        <p className="text-lg mb-4">{product.description}</p>
        <Link href={`/categories/${category.id}`}>
          <a>View more products in this category</a>
        </Link>
        
  

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
