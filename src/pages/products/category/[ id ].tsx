import { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { fetchProductDetails } from '@/lib/api'; 
import { ProductsType } from '@/lib/types'; 
import { useCart } from '@/hooks/useCart'; 
import { useModal } from '@/lib/contexts/ModalContext'; 
import Layout from '@/components/Layout';


// Fetch product details on the server side using getServerSideProps
export const getServerSideProps: GetServerSideProps<DetailPageProps> = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const product = await fetchProductDetails(Number(id)); // Fetch product details from the API

    if (!product) {
      return {
        notFound: true, // Show a 404 page if the product is not found
      };
    }

    return {
      props: {
        product,
      },
    };
  } catch (error) {
    console.error('Failed to fetch product details:', error);
    return {
      notFound: true, // Show a 404 page if there's an error
    };
  }
};



interface DetailPageProps {
  product: ProductsType; // Data fetched on the server
}

const ProductDetailPage = ({ product }: DetailPageProps) => {
  //const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addProductToCart } = useCart();
  const { setIsCartModalOpen } = useModal(); 
  const [error] = useState<string | null>(null);
  const [fetchedProduct] = useState<ProductsType | null>(null);

  // Fetch product details using the product ID
  // useEffect(() => {
  //   if (!product) return; // If there's no product, don't proceed

  //   setFetchedProduct(product); // Directly set fetched product if server-side rendering is successful
  // }, [product]);


  // Handler to add product to cart and open the modal
  const handleAddToCart = () => {
    if (fetchedProduct) {
      addProductToCart({ ...fetchedProduct, quantity: 1 }); // Add the product to the cart
      setIsCartModalOpen(true); // Open the cart modal
    }
  }; 

  // Loading state (if needed for client-side updates)
  if (!fetchedProduct && !error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-red-600 text-center p-4 bg-red-100 rounded-lg">
        {error}
        <button
          onClick={() => router.reload()} // Reload the page to retry
          className="mt-2 bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()} 
          className="mb-6 bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600"
        >
          Back
        </button>

        {/* Product Details */}
        <h2 className="text-4xl font-bold mb-6">{fetchedProduct?.title}</h2>
        <img
          src={fetchedProduct?.images[0]}
          alt={fetchedProduct?.title}
          className="mb-4 w-full max-w-md mx-auto aspect-square object-cover rounded-lg shadow-lg"
        />
        <p className="text-lg mb-4">{fetchedProduct?.description}</p>
        <p className="text-xl font-semibold mb-4">${fetchedProduct?.price}</p>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="bg-blue-500 
          text-white py-2 
          px-6 rounded-md hover:bg-blue-600 
          disabled:bg-gray-300 
          disabled:cursor-not-allowed"
          aria-label="Add to Cart"
          role="button"
          tabIndex={0}
        >
          Add to Cart
        </button>
      </div>
    </Layout>
  );
}

export default ProductDetailPage;

