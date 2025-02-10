  //import type { NextPage } from 'next';
  import { useState, useEffect } from 'react';
  import  Link  from 'next/link';
   import { ProductsType, Category } from "@/lib/types";  
 // import { useAuth } from '../hooks/useAuth';    
  import { GetStaticProps } from 'next';
  import { getCategory, fetchProductsByCategory } from '@/lib/api';
  //import { fetchProducts } from '@/lib/api';
  //import Layout from '@/components/Layout';

  interface HomePageProps {
  //  products: ProductsType[]; // Data fetched on the server
    categories: Category[];
  }
  
  // Fetch the products and categories at build time using `getStaticProps`
  export const getStaticProps: GetStaticProps = async () => {
    try {
      // Fetch categories from the server at build time
    
      const categories = await getCategory();
  
      return {
        props: {
  
          categories,
        },
        revalidate: 60,
      };
    } catch (error) {
      return {
        props: {
    
          categories: [],
        },
      };
    }
  };
  
  
 
  export default function HomePage({ categories }: HomePageProps) {
    //  const { user } = useAuth();
      const [categoryProducts, setCategoryProducts] = useState<{ [key: string]: ProductsType[] }>({});
      const [error, setError] = useState<string | null>(null);
      const [isLoading, setIsLoading] = useState<boolean>(false);
     
     
      //const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
      // Store products for client-side rendering
      //const [clientProducts, setClientProducts] = useState<ProductsType[]>([]);
    
    // Fetch additional client-side data
    useEffect(() => {
      const fetchCategoryProducts = async () => {
        try {
          setIsLoading(true);
          const productsByCategory: { [key: string]: ProductsType[] } = {};
          
          // Loop over categories to fetch products for each
          for (const category of categories) {
            // Ensure category.id is treated as a number
            const categoryIdAsNumber = typeof category.id === 'string' ? parseInt(category.id, 10) : category.id;
    
            // Fetch 12 products per category
            const fetchedProducts = await fetchProductsByCategory(categoryIdAsNumber, 12);
            productsByCategory[String(category.id)] = fetchedProducts; // Using category.id as string key
          }
          setCategoryProducts(productsByCategory);
        } catch (error) {
          setError('Failed to load products.');
        } finally {
          setIsLoading(false);
        }
      };
  
      if (categories.length > 0) {
        fetchCategoryProducts();
      }
    }, [categories]);
  
    
      // Close the modal and hide the header
      // const handleModalClose = () => {
      //   setIsModalOpen(false); // Close the modal
      // };
    
    
    return (
      <div className="container mx-auto p-6">
      {/* Error or Loading State */}
      {isLoading && <p>Loading categories...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display Categories */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.id}`}>
              <div className="bg-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition-colors">
                Shop our {category.name}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        {/* Scroll Left Button */}
        <button
          onClick={() => {
            const productGrid = document.getElementById('product-grid');
            if (productGrid) {
              productGrid.scrollBy({ left: -200, behavior: 'smooth' });
            }
          }}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10"
        >
          &larr;
        </button>

        {/* Scrollable Product Grid */}
        <div id="product-grid" className="overflow-x-auto whitespace-nowrap scroll-smooth max-w-screen-lg mx-auto">
          <div className="inline-flex gap-6 p-4">
            {/* Display the first 4 categories */}
            {categories.slice(0, 4).map((category) => (
              <div key={category.id} className="w-96 flex-shrink-0 p-4 border rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out">
                <h3 className="text-lg font-semibold mb-4">{category.name}</h3>
                {/* Scrollable Product List */}
                <div className="overflow-x-auto flex gap-4">
                  {categoryProducts[String(category.id)]?.map((product) => (
                    <div key={product.id} className="flex-shrink-0 w-64">
                      <Link href={`/products/${product.id}`}>
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-64 object-cover rounded"
                        />
                        <h4 className="text-md font-semibold mt-2">{product.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => {
            const productGrid = document.getElementById('product-grid');
            if (productGrid) {
              productGrid.scrollBy({ left: 200, behavior: 'smooth' });
            }
          }}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}

//export default HomePage;

