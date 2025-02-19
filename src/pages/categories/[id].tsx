'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { fetchCategories, fetchProductsByCategory } from '@/lib/api';
import { ProductsType, CategoryType, Params } from '@/lib/types';  // Assuming you have this type
import { GetStaticProps, GetStaticPaths } from 'next';
import DynamicImageComponent from '@/components/DynamicImage';


interface ProductCategoryProps {
    //onAddToCart?: () => void;
    products: ProductsType[];
    category: CategoryType; 
}
// Fetching a single product by ID for dynamic routing
export const getStaticPaths: GetStaticPaths = async () => {
  try {
        // Fetch all product IDs (you can create a separate function for this)
        const categories = await fetchCategories(); //  fetches the list of all products
        console.log('Categories:', categories.map(c => c.id));
        console.log('Fetched categories:', categories);
        
        const paths = categories
      .map((category: { id: string | any}) => {
        // Ensure category has a valid ID
        if (category?.id) { // Add optional chaining
          return { 
            params: { 
              id: category.id.toString() // Convert ID to string explicitly
            } 
          }; 
        }
        return null;
      })
      .filter(Boolean) as { params: { id: string } }[];
      console.log('Generated paths:', paths);

        return {
          paths,
          fallback: 'blocking',  // Set to false to return 404 if the path doesn't exist
        };
      } catch (error) {
        console.error('Error fetching categories:', error);
        return {
          paths: [],
          fallback: 'blocking', 
        };
      } 
    };

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.id) {
    // Return a 404 or handle the error if `id` is missing
    return { notFound: true };
  }
  
  const { id } = params as Params;  
  
    if (!id) {
      return { notFound: true };  // Return 404 if the category isn't found
    }

    try{
    // Fetch the category details using the product's category ID
    const categoryRes = await fetch(`https://api.escuelajs.co/api/v1/categories/category/${id}`);
    const category: CategoryType[] = await categoryRes.json();

    // Find the category that matches the product's category ID
    //const category = categories.find((cat: CategoryType) => cat.id === categoryId);
    const products = await fetchProductsByCategory(id);


  return {
    props: {    
      category,
      products,
    },
    revalidate: 60,
  };
}catch (error) {
  console.error('Error fetching product data:', error);
  return { notFound: true };  // Return a 404 page in case of error
}
};


const ProductCategoryPage = ({ products, category }: ProductCategoryProps) => {
    //const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
      // Filter products based on the search term
    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
      

      //  const handleAddToCart = () => {
      //      setIsModalOpen(true); // Open the modal in the parent component
      //    };
   
      if (!category || !products) return <div>Loading...</div>;
   
       return (
        <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          {category.name} 
        </h1>
  
        {/* Search input */}
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
              <div
                key={product.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              >
                {/* Wrap the image inside a Link to navigate to the product details */}
                <Link href={`/products/${product.id}`}>
                  <div className="relative w-full h-64 mb-4">
                  <DynamicImageComponent
                    imageUrl={product.imageUrl || null}
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


export default ProductCategoryPage;
