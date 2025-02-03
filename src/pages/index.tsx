  import type { NextPage } from 'next';
  import { useState, useEffect, useMemo } from 'react';
  import  Link  from 'next/link';
  import Banner from "../layout/Header";
  import { ProductsType, Category } from "@/lib/types";  
 // import { useAuth } from '../hooks/useAuth';    
  import { GetStaticProps } from 'next';
  import { getCategory } from '@/lib/api';
  import { fetchProducts } from '@/lib/api';
  

  interface HomePageProps {
    products: ProductsType[]; // Data fetched on the server
    categories: Category[];
  }
  
  // Fetch the products and categories at build time using `getStaticProps`
  export const getStaticProps: GetStaticProps = async () => {
    try {
      // Fetch products and categories from the server at build time
      const products = await fetchProducts();
      const categories = await getCategory();
  
      return {
        props: {
          products, // These will be passed as props to the component
          categories,
        },
        revalidate: 60,
      };
    } catch (error) {
      return {
        props: {
          products: [],
          categories: [],
        },
      };
    }
  };
  
  
  
  export default function HomePage({ products, categories }: HomePageProps) {
  //  const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
    // Store products for client-side rendering
    const [clientProducts, setClientProducts] = useState<ProductsType[]>([]);
  
  // Fetch additional client-side data
  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true);
        const { products: fetchedProducts } = await fetchProducts();
        setClientProducts(fetchedProducts);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load products.');
      } finally {
        setIsLoading(false);
      }
    };
  // Optionally fetch data when the component mounts
      if (products.length === 0) {
        getProducts(); // If no data from SSR, fetch on the client-side
      }
    }, [products]); // optional:Dependency on products to ensure it only runs when products are empty
  
  
    // Memoize filtered products based on selected category
    const filteredProducts = useMemo(() => {
      const productsToFilter = clientProducts.length > 0 ? clientProducts : products;
      if (selectedCategory === '') {
        return productsToFilter; // Show all products if no category is selected
      }
      return productsToFilter.filter(product => {
        return product.category && product.category.id === parseInt(selectedCategory);
      });
    }, [clientProducts, selectedCategory, products]);
    
  
    // Close the modal and hide the header
    const handleModalClose = () => {
      setIsModalOpen(false); // Close the modal
    };
  
  
  
    return (
      <div className="container mx-auto p-6">
    
        {/* {!isModalOpen && <Banner />} */}
  
        {/* Display a welcome message if the user is logged in */}
        {/* {user && (
          <div className="text-center mb-6">
            <p className="text-lg">Welcome back, {user.name}!</p>
          </div>
        )} */}
  
  {/* Display Categories */}
  <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`} // Pass category ID as a query parameter
            
            >
              <div className="bg-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition-colors">
                Shop our {category.name}
              </div>
            </Link>
          ))}
        </div>
      </div>

        {/* Main Content */}
        
  <div className="relative"> {/* Parent container for positioning buttons */}
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
          {Array.isArray(products) && products.slice(0, 12).map((product) => (
            <div
              key={product.id}
              className="w-96 
              flex-shrink-0 
              p-4 border 
              rounded-lg 
              shadow-lg 
              hover:shadow-xl 
              transition-all 
              duration-500 
              ease-in-out"
            >
              {/* Product Image and Title */}
              <Link href={`/products/${product.id}`}>
               
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-128 object-cover mb-4 rounded"
                />
               
              </Link>
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
};

//export default HomePage;

