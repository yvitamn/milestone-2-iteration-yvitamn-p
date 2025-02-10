import { GetServerSideProps } from 'next';
import { fetchProductWithCategory } from '@/lib/api'; // Fetch single product by ID
import { ProductsType } from '@/lib/types';
//import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { categoryId, id } = context.params as { categoryId: string; id: string };
  let product: ProductsType | null = null;

  try {
    product = await fetchProductWithCategory(Number(id)); // Fetch product by ID and category
  } catch (error) {
    console.error('Error fetching product:', error);
  }

  return {
    props: {
      product,
      categoryId,
    },
  };
};

interface ProductDetailWithCategoryProps {
  product: ProductsType | null;
  categoryId: string;
}

const ProductDetailPageWithCategory = ({ product, categoryId }: ProductDetailWithCategoryProps) => {
  if (!product) return <div>Product not found</div>;

  return (
    <Layout>
      <div className="container mx-auto p-6">

      <div className="mb-4">
          <Link href={`/products/category/${categoryId}`}>
            <a className="back-button mb-6">
              Back to category</a>
          </Link>
        </div>

        <h2 className="text-4xl font-bold mb-6">{product.title}</h2>
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-auto aspect-square object-cover rounded-lg"
        />
        <p className="text-lg mb-4">{product.description}</p>
        <p className="text-xl font-semibold mb-4">${product.price}</p>
      </div>
    </Layout>
  );
};

export default ProductDetailPageWithCategory;
