'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { fetchCategories, fetchProductDetails } from '@/lib/api';
import { ProductsType, CategoryType } from '@/lib/types';  // Assuming you have this type
import { GetStaticProps, GetStaticPaths } from 'next';
//import { ProductDetail } from '@/components/ProductDetail';


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
        const paths = categories.map((category) => ({
          params: { id: category.id.toString() },
        }));
    
        return {
          paths,
          fallback: false,  // Set to false to return 404 if the path doesn't exist
        };
      } catch (error) {
        console.error('Error fetching categories:', error);
        return {
          paths: [],
          fallback: false, 
        };
      } 
    };

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const categoryId = params?.id;
  //try{
  const productsRes = await fetchProductDetails(parseInt(categoryId as string));
  const products: ProductsType[] = await productsRes.json();

  const categoryRes = await fetch('https://api.escuelajs.co/api/v1/categories');
  const categories: CategoryType[] = await categoryRes.json();
  const category = categories.find((cat) => cat.id === parseInt(categoryId as string));

  if (!category) {
    return { notFound: true };  // Return 404 if the category isn't found
  }

  return {
    props: {
      products,
      category,
    },
    revalidate: 60,
  };
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
   
       if (!products) return <div>Product not found</div>;
   
       return (
        <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          {category.name} - Products
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


export default ProductCategoryPage;
