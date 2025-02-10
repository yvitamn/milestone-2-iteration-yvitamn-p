import { GetServerSideProps } from 'next';
import { fetchProductDetails } from '@/lib/api'; // Fetch single product by ID
import { ProductsType } from '@/lib/types';
import Layout from '@/components/Layout';
import Link from 'next/link';


export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  let product: ProductsType | null = null;
  try {
    product = await fetchProductDetails(Number(id)); // Fetch product by ID
  } catch (error) {
    console.error('Error fetching product details:', error);
  }
  if (!product) {
    return {
      notFound: true, // Show 404 if the product is not found
    };
  }

  return {
    props: {
      product,
    },
  };
};

interface ProductDetailProps {
  product: ProductsType | null;
}

const ProductDetailPage = ({ product }: ProductDetailProps) => {
  if (!product) return <div>Product not found</div>;

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <Link href="/products">
          <a className="back-button mb-6">Back to Products</a> {/* You can change the link as needed */}
        </Link>
        <h2 className="text-4xl font-bold mb-6">{product.title}</h2>
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-auto aspect-square object-cover rounded-lg"
        />
        <p className="text-lg mb-4">{product.description}</p>
        <p className="text-xl font-semibold mb-4">${product.price}</p>
      
        {/* Add to Cart Button */}
        <button onClick={() => {}} className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600">
            Add to Cart
            </button>
      
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
