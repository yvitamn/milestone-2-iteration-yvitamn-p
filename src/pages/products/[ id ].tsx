'use client';
import { GetStaticPaths, GetStaticProps } from 'next';
import { fetchProductDetails, fetchProducts } from '@/lib/api';
import { CategoryType, ProductsType } from '@/lib/types';
import { useState } from 'react';
import { ProductDetail } from '@/components/ProductDetail';



interface ProductDetailProps {
  onAddToCart?: () => void;
    product: ProductsType;
    category: CategoryType; 
  }
  
  export const getStaticPaths: GetStaticPaths = async () => {
    try {
      // Fetch all product IDs (you can create a separate function for this)
      const products: ProductsType[] = await fetchProducts(); //  fetches the list of all products
  
      const paths = products.map((product) => ({
        params: { id: product.id.toString() }, // Dynamic route for product ID
      }));
  
      return {
        paths,
        fallback: 'blocking', 
      };
    } catch (error) {
      console.error('Error fetching product paths:', error);
      return { paths: [], fallback: 'blocking' };
    }
  };

  export const getStaticProps: GetStaticProps<ProductDetailProps> = async ({ params }) => {
    try {
      const productId = params?.id as string;  // Capture the product ID as string
  
      // Convert productId to a number if necessary (because your API expects number)
      const id = typeof productId === 'string' ? parseInt(productId, 10) : productId;
  
      // Fetch product details
      const product = await fetchProductDetails(id);
  
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
      console.error('Error fetching product details:', error);
      return {
        notFound: true,
      };
    }};

const ProductDetailPage = ({ onAddToCart, product, category }: ProductDetailProps) => {   
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    const handleAddToCart = () => {
        setIsModalOpen(true); // Open the modal in the parent component
      };

    if (!product) return <div>Product not found</div>;

    return (
        <ProductDetail
    product={product}
    backLink="/products"
    backLinkText="Back to Products"
    onAddToCart={handleAddToCart}
  />
);
};

export default ProductDetailPage;
