'use client';
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchProductDetails, fetchProducts } from '@/lib/api';
import { CategoryType, Params, ProductsType } from '@/lib/types';
import { useState } from 'react';
import { ProductDetail } from '@/components/ProductDetail';
import CartModal from '@/components/CartModal';


interface ProductDetailProps {
    onAddToCart: () => void;
    product: ProductsType;
    category: CategoryType; 
    
}

  export const getStaticPaths: GetStaticPaths = async () => {
    try{
    const products = await fetchProducts();
    
    const paths = products.map((product: string | any) => ({
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
    if (!params?.id) {
        // Return a 404 or handle the error if `id` is missing
        return { notFound: true };
      }
    
    try {
        const { id } = params as Params;    // Capture the product ID as string
  
      if (!id) {
        return { notFound: true };
      }
      // Convert productId to a number if necessary (because your API expects number)
     // const id = typeof productId === 'string' ? parseInt(productId, 10) : productId;
  
      // Fetch product details
      const product = await fetchProductDetails(id as string);
  
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

      // Fetch related products (you can adjust the logic as needed for fetching related products)
    // const allProducts = await fetchProducts();
    // const relatedProducts = allProducts.filter((p: ProductsType) => p.category.id === product.category.id && p.id !== product.id);
      
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
    

const ProductDetailPage = ({ category, product }: ProductDetailProps) => {   
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addedProducts, setAddedProducts] = useState<ProductsType[]>([]);

    const handleAddToCart = () => {
        console.log("Product added to cart:", product.title);
        setIsModalOpen(true); // Open the modal in the parent component
        setAddedProducts([...addedProducts, product]);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the CartModal
      };

    return (
        <>
        <ProductDetail
    product={product}
    category={category}
    backLink="/products"
    backLinkText="Back to Products"
    onAddToCart={handleAddToCart}
  />
       {/* Render the CartModal when `isModalOpen` is true */}
       <CartModal isOpen={isModalOpen} onClose={handleCloseModal} cartItems={addedProducts} />
      
    </>
  );
};


export default ProductDetailPage;
