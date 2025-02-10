import { GetStaticProps } from 'next';
import { fetchProducts } from '@/lib/api'; // Fetch products from the API
import { ProductsType, Category } from '@/lib/types';
import { useCategories } from '@/hooks/useCategories';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export const getStaticProps: GetStaticProps = async () => {
  let products: ProductsType[] = [];
  try {
    products = await fetchProducts(); // Fetch all products
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return {
    props: {
      products,
    },
    revalidate: 3600,
  };
};

interface ProductsPageProps {
  products: ProductsType[];
  
}

const ProductsPage = ({ products }: ProductsPageProps) => {
  // Fetch categories to display as filter options
  const { data: categories, loading, error } = useCategories('all'); // Use the hook to get categories
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    // Reset category selection when the page loads
    setSelectedCategory(null);
  }, []);

   // Filter products based on selected category
   const filteredProducts = selectedCategory
   ? products.filter(
       (product) => product.category?.id.toString() === selectedCategory
     )
   : products;

  if (loading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories: {error}</div>;




  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-bold mb-6">All Products</h2>

      {/* <div className="mb-4">
        <select
          onChange={(e) => {
            const categoryId = e.target.value;
            setSelectedCategory(categoryId || null); // Set category based on selection
          }}
        >
          <option value="">Select a category</option>
          {categories?.map((category: Category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-lg">
              <Link href={`/products/${product.id}`}>
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-auto aspect-square object-cover rounded-lg"
                />
                <h3 className="text-xl mt-4">{product.title}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
