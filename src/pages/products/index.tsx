'use client';
import Image from 'next/image'
import { useState } from 'react';
import Link from 'next/link'; 
import { fetchProducts } from '@/lib/api';
import { ProductsType } from '@/lib/types';  
import { GetStaticProps } from 'next';
import { Search } from 'lucide-react';
import { useRouter } from 'next/router';


export const getStaticProps: GetStaticProps = async () => {
 try{
    const products = await fetchProducts();  // This will return an array of all products
 
  return {
    props: {
      products,  // Pass the products array as props to the page
    },
    revalidate: 60,  // Optional: If you want Incremental Static Regeneration every 60 seconds
  };
}catch (error) {
  console.error('Error fetching products:', error);
  return {
    props: {
      products: [],  // If fetching fails, pass an empty array to avoid crashing
    },
  };
}
};



const ProductPage = ({ products }: { products: ProductsType[] }) => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // Filter products based on the search term
  const filteredProducts = products.filter((product) => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) // Match search term with product title
  );

  return (
    <div className="container mx-auto px-4 py-10">
    <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">All Products</h1>

    {/* Search input with search icon */}
    <div className="mb-6 flex items-center justify-center space-x-2">
      <Search className="text-gray-500" size={20} /> {/* Search icon */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 w-64 border border-gray-300 rounded-lg"
      />
    </div>

     {/* Display filtered products */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <div key={product.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer">
          {/* Wrap the image inside a Link to navigate to the category page */}
          <Link href={`/products/categories/${product.category.id}`}>
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
        <p>No products found matching your search.</p>
      )}
    </div>
  </div>
);
};

export default ProductPage;