'use client';
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchProductDetails, fetchProducts } from '@/lib/api';
import { CategoryType, ProductsType } from '@/lib/types';
import { useState } from 'react';
import { ProductDetail } from '@/components/ProductDetail';
import { X } from 'lucide-react';


interface ProductDetailProps {
    onAddToCart: () => void;
    product: ProductsType;
    //category: CategoryType; 
  }
  
  export const getStaticPaths: GetStaticPaths = async () => {
    try{
    const products = await fetchProducts();
    
    const paths = products.map((product) => ({
        params: { id: product.id.toString() }, // Dynamic route for product ID
      }));
  
      return {
        paths,
        fallback: false, // Set to false if you don't want fallback for missing paths
      };
    } catch (error) {
        console.error('Error fetching products for static paths:', error);
        return { paths: [], fallback: false };
      }
    };

  export const getStaticProps: GetStaticProps = async ({ params }) => {
    try {
      const productId = params?.id;  // Capture the product ID as string

      if (!productId) {
        return { notFound: true };
      }
      // Convert productId to a number if necessary (because your API expects number)
     // const id = typeof productId === 'string' ? parseInt(productId, 10) : productId;
  
      // Fetch product details
      const product = await fetchProductDetails(parseInt(productId as string));
  
      if (!product) {
        return { notFound: true }; // Return 404 if the product is not found
      }
  
        // Fetch the category details using the product's category ID
        const categoryRes = await fetch(`https://api.escuelajs.co/api/v1/categories`);
        const categories: CategoryType[] = await categoryRes.json();
        // Find the category that matches the product's category ID
        const category = categories.find((cat: CategoryType) => cat.id === product.category.id);

        if (!category) {           
      return { notFound: true }; 
      }
      return {
        props: {
          product,
          category,
        },
        revalidate: 60, // Optional: revalidate the page after 60 seconds (optional for ISR)
      };
    } catch (error) {
        console.error('Error fetching product data:', error);
        return { notFound: true };  // Return a 404 page in case of error
      }
    };
    

const ProductDetailPage = ({ onAddToCart, product }: ProductDetailProps) => {   
    const [isModalOpen, setIsModalOpen] = useState(false);
    

    const handleAddToCart = () => {
        setIsModalOpen(true); // Open the modal in the parent component
      };

    //   if (!product || !category) {
    //      return <div>Product not found</div>;
    //   }
    return (
        <>
        <ProductDetail
    product={product}
    //category={category}
    backLink="/products"
    backLinkText="Back to Products"
    onAddToCart={handleAddToCart}
  />
       {/* Modal - Rendered when `isModalOpen` is true */}
      {isModalOpen && (
        
      )}
    </>
  );
};

export default ProductDetailPage;
