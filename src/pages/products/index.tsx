
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { fetchProducts } from '@/lib/api';
import { 
  ProductsType, 
  Category
  } from '@/lib/types';
//import { useAuth } from '@/hooks/useAuth';
import { getCategory } from '@/lib/api';
import Navbar from '@/layout/Navbar';
import Layout from '@/components/Layout';

interface ProductsProps {
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



export default function ProductsPage({ products, categories }: ProductsProps) {
//  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  //const [filteredProducts, setFilteredProducts] = useState<ProductsType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0); // Store total number of products
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

  getProducts();
}, [currentPage, itemsPerPage]); 

// Optionally fetch data when the component mounts
  //   if (products.length === 0) {
  //     getProducts(); // If no data from SSR, fetch on the client-side
  //   }
  // }, [products]); // optional:Dependency on products to ensure it only runs when products are empty


 // Memoize filtered products based on selected category
  const memoizedFilteredProducts = useMemo(() => {
    const productsToFilter = clientProducts;
    //.length > 0 ? clientProducts : products;
    if (selectedCategory === '') {
      return productsToFilter; // Show all products if no category is selected
    }
    return productsToFilter.filter((product) => {
      return product.category && product.category.id === parseInt(selectedCategory);
    });
  }, [clientProducts, selectedCategory]);


  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to page 1 when the category changes
  };

  // Pagination controls
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // Change current page
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to page 1 when items per page changes
  };

  
   return (
    <Layout>
    <div className="container mx-auto p-6">
      <Navbar categories={categories} onCategoryChange={handleCategoryChange} />
      {/* Welcome message for logged-in users */}
      {/* {user && (
        <div className="text-center mb-6">
          <p className="text-lg">Welcome back, {user.name}!</p>
        </div>
      )} */}


      {/* Error or Loading State */}
      {isLoading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}
            

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* {filteredProducts.length === 0 ? ( */}
         
          {Array.isArray(memoizedFilteredProducts) && memoizedFilteredProducts.length > 0 ? (
            memoizedFilteredProducts.map((product) => (
              <div key={product.id} className="col-span-1 p-4 border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
                <Link href={`/products/${product.id}`}>           
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-full h-auto aspect-square object-cover mb-4 rounded"
              />
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
             
              </Link>
            </div>
          ))
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>
    
    {/* Pagination Controls */}
    <div className="flex justify-between items-center mt-6">
          <label>Items per page:</label>
          <select onChange={handleItemsPerPageChange} value={itemsPerPage} className="p-2 border rounded">
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={36}>36</option>
          </select>

          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="mx-4">{currentPage} / {totalPages}</span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}


//export default ProductsPage;





