'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchProducts, fetchCategories } from '@/lib/api'; // Your API fetching logic
import { ProductsType } from '@/lib/types'; // Assuming you have this type
import { Search } from 'lucide-react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';

// Fetch categories for dynamic paths (optional if needed for future use)
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const categories = await fetchCategories(); // You should have a fetchCategories function
    const paths = categories.map((category) => ({
      params: { id: category.id.toString() }, // Create a path for each category ID
    }));
    return { paths, fallback: false };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { paths: [], fallback: false };
  }
};

// Fetch products for the specific category
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categoryId = params?.id;

  try {
    const products = await fetchProducts();  // Fetch all products
    const filteredProducts = products.filter((product) => product.category.id === categoryId);  // Filter products by category ID

    return {
      props: {
        products: filteredProducts,  // Pass the filtered products based on category
      },
      revalidate: 60,  // Optional: Revalidate every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching products for category:', error);
    return {
      props: {
        products: [],  // In case of an error, pass an empty array
      },
    };
  }
};

const CategoriesPage = ({ products }: { products: ProductsType[] }) => {
  const [searchTerm, setSearchTerm] = useState('');  // State for search term
  const router = useRouter();
  const { id } = router.query;  // Get category ID from the URL

  // Filter products based on the search term
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) // Match search term with product title
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Category {id}</h1>

      {/* Search input with search icon */}
      <div className="mb-6 flex items-center justify-center space-x-2">
        <Search className="text-gray-500" size={20} /> {/* Search icon */}
        <input
          type="text"
          placeholder="Search products in this category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}  // Update search term on input change
          className="p-2 w-64 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Display filtered products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              {/* Wrap the image inside a Link to navigate to the product detail page */}
              <Link href={`/products/${product.id}`}>
                <div className="relative w-full h-64 mb-4">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    width={500}
                    height={400}
                    className="rounded-lg object-cover"
                  />
                </div>
              </Link>
              <h3 className="text-xl font-semibold text-gray-800">{product.title}</h3>
              <p className="text-xl font-bold text-green-600 mt-4">${product.price}</p>
            </div>       
          ))
        ) : (
          <p>No products found matching your search.</p>  // If no products match the search term
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
