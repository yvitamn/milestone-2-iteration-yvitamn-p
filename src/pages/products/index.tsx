
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { fetchProducts, fetchProductsByCategory, getCategory } from '@/lib/api';
import { ProductsType, Category } from '@/lib/types';
import Navbar from '@/layout/Navbar';
import { useRouter } from 'next/router';
import { useMemoizedProducts } from '@/hooks/useMemoizedProducts'; 


interface ProductsProps {
  products: ProductsType[]; // Data fetched on the server
  categories: Category[];
}

// Fetch the products and categories at build time using `getStaticProps`
export const getServerSideProps: GetServerSideProps<ProductsProps> = async (context) => {
  //console.log('Context Query:', context.query);
  const { category } = context.query;//acces from the query
  
  let products: ProductsType[] =[];
  let categories: Category[] = [];// Define categories as an array of Category
  
  try {   
    // Ensure categoryId is a valid string or number
    const categoryId: string | number | undefined = Array.isArray(category) ? category[0] : category;

    // If categoryId exists and is a string or number, ensure it's parsed correctly
    const categoryIdAsNumber = categoryId ? Number(categoryId) : null;  // Convert to number

     // If categoryId is still a valid number, use it
     if (categoryIdAsNumber && !isNaN(categoryIdAsNumber)) {
      const { products: fetchedProducts } = await fetchProductsByCategory(categoryIdAsNumber, 12);
      products = Array.isArray(fetchedProducts) ? fetchedProducts : [];
   } else {    
      const fetchedProducts = await fetchProducts(); // Check what this returns
      products = Array.isArray(fetchedProducts) ? fetchedProducts : [];
    }
 
    // Fetch categories and ensure it's always an array
    const fetchedCategories = await getCategory();
    categories = Array.isArray(fetchedCategories) ? fetchedCategories : [fetchedCategories];
  
  } catch (error) {
    console.error('Error fetching products or categories:', error);
    products = []; // Default to empty array if fetching fails
    categories = []; // Default to empty array if fetching fails
  }

  return {
    props: {
      products,
      categories,
    },
  };
};



export default function ProductsPage({ products, categories }: ProductsProps) {
    const router = useRouter();
    const { category } = router.query;

    // Make sure `selectedCategory` is a string, not an array
  const [selectedCategory, setSelectedCategory] = useState<string>(category || ''); // Initializing as a string

  useEffect(() => {
    if (Array.isArray(category)) {
      setSelectedCategory(category[0]); // If it's an array, just pick the first value
    } else {
      setSelectedCategory(category || ''); // Set the category string or empty string
    }
  }, [category]);

   
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [itemsPerPage, setItemsPerPage] = useState<number>(12);
    const [currentPage, setCurrentPage] = useState<number>(1);
   // const [clientProducts, setClientProducts] = useState<ProductsType[]>([]);


//custom hook for memoization
const {
  memoizedFilteredProducts,
  memoizedTotalPages,
  memoizedDisplayedProducts,
  memoizedCategories,
} = useMemoizedProducts({
  products,
  categories,
  selectedCategory,
  itemsPerPage,
  currentPage,
});

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to page 1 when items per page changes
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    router.push(`/products?category=${categoryId}`);
  };

  
   return (
    //<Layout>
    <div className="container mx-auto p-6">
      <Navbar categories={memoizedCategories} onCategoryChange={handleCategoryChange} />
    

      {/* Error or Loading State */}
      {isLoading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}
            

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {memoizedFilteredProducts.length > 0 ? (
          memoizedDisplayedProducts.map((product) => (
            <div key={product.id} className="col-span-1 p-4 border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
              <Link href={`/products/${product.id}`}>
                <img src={product.images[0]} alt={product.title} className="w-full h-auto aspect-square object-cover mb-4 rounded" />
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
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 border rounded disabled:opacity-50">
            Previous
          </button>

          <span className="mx-4">
            {currentPage} / {memoizedTotalPages}
          </span>

          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === memoizedTotalPages} className="px-4 py-2 border rounded disabled:opacity-50">
            Next
            </button>
          </div>
        </div>
      </div>
    //</Layout>
  );
}


//export default function ProductsPage;
// ({ products, categories }: ProductsProps) {





