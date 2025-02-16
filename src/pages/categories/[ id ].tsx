'use client';

import { useState } from 'react';
import Image from 'next/image';
import { fetchProducts } from '@/lib/api';
import { ProductsType } from '@/lib/types';  // Assuming you have this type
import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { useCart } from '@/hooks/useCart';


// Fetching a single product by ID for dynamic routing
export const getStaticPaths: GetStaticPaths = async () => {
  const products = await fetchProducts();
  const paths = products.map((product) => ({
    params: { id: product.id.toString() },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const productId = params?.id;
  const product = await fetchProducts().then((products) =>
    products.find((product) => product.id.toString() === productId)
  );

  if (!product) {
    return {
      notFound: true, // Return a 404 if the product is not found
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 60,  // Optional: Revalidate every 60 seconds
  };
};

const ProductDetailPage = ({ product }: { product: ProductsType }) => {
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const { addProductToCart } = useCart();
    const router = useRouter();
    const { id } = router.query;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">{product.title}</h1>
      <div className="flex items-center justify-center space-x-6">
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={500}
          height={500}
          className="rounded-lg"
        />
        <div className="space-y-4">
          <p className="text-xl font-semibold text-gray-800">{product.description}</p>
          <p className="text-xl font-bold text-green-600">${product.price}</p>
        </div>
      </div>

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
