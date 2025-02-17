'use client';
import Link from 'next/link';
import Image from 'next/image';
import {  ProductsType, CategoryType } from '@/lib/types';
import useCart from '@/hooks/useCart';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface ProductDetailProps {
  product: ProductsType;
  category: CategoryType;
  backLink: string;
  backLinkText: string;
  onAddToCart: () => void;
}

export const ProductDetail = ({ 
    product, 
    category, 
    onAddToCart, 
    backLink, 
    backLinkText 
}: ProductDetailProps) => {
        const [isAdding, setIsAdding] = useState<boolean>(false);
        const { addProductToCart } = useCart();
        const [error, setError] = useState<string | null>(null);
        const router = useRouter();
       //const { id } = router.query;
    
            // Fallback loading state when product is being fetched
        if (router.isFallback) {
            return <div>Loading...</div>;
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
          
                if (onAddToCart) { // Ensure onAddToCart is defined before calling it
                    onAddToCart();  
                  }
              
          
              } catch (error) {
                console.error("Error adding product to cart:", error);
                setIsAdding(false); // Set loading state to false even if there's an error
              }
            }
          }; 
      
         
        if (error) {
            return <div>{error}</div>;
        }
  
    return (
    <div className="container mx-auto p-6">
        <Link href={backLink}>
            <span className="back-button mb-6">{backLinkText}</span>
        </Link>

        {/* Product Title */}
        <h2 className="text-4xl font-bold mb-6">{product.title}</h2>
  
        {/* Product Image */}
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={500}
          height={400}
          className="rounded-lg mb-4"
          //layout="responsive"
         // objectFit="cover"
        />

        //Product Price
        <p>
          <strong>category</strong> {category.name}
        </p>
        <p className="text-xl font-semibold mb-4">${product.price}</p>
         //Product Description 
        <p className="text-lg mb-4">{product.description}</p>
         <Link href={`/categories/${category.id}`}>
          <span className="cursor-pointer">view more products in this category</span>
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
