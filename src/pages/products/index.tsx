
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
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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


  // Handle category change
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };



  
   return (
    <div className="container mx-auto p-6">
      {/* Header */}
      {/* <Banner /> */}

      {/* Welcome message for logged-in users */}
      {/* {user && (
        <div className="text-center mb-6">
          <p className="text-lg">Welcome back, {user.name}!</p>
        </div>
      )} */}

{/* Category Filter */}
<div className="mb-6 text-center">
        <label htmlFor="category-select" className="mr-2">Filter by Category:</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border rounded"
          aria-label="Filter products by category"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>


      {/* Error or Loading State */}
      {isLoading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}
            

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          filteredProducts.map((product) => (
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
        )}
      </div>
    </div>
  );
}


//export default ProductsPage;





