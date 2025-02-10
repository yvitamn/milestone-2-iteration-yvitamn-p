 
  import { useState, useEffect } from 'react';
  import  Link  from 'next/link';
  import { ProductsType, CategoryTopCategories } from "@/lib/types";  
  import { fetchTopCategoriesWithProducts } from '@/lib/apiTopCategories';
  import Layout from '@/components/Layout';

  
 
  export default function HomePage() {
    const [categories, setCategories] = useState<CategoryTopCategories[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
     
      useEffect(() => {
        const fetchCategoriesWithProducts = async () => {
          setLoading(true);
          try {
            const categoriesWithProducts = await fetchTopCategoriesWithProducts(20); // 20 products per category
            setCategories(categoriesWithProducts);
          } catch (err) {
            setError('Failed to load categories and products');
          } finally {
            setLoading(false);
          }
        };
    
        fetchCategoriesWithProducts();
      }, []);


    return (
      <Layout>
      <div className="container mx-auto p-6">
        {/* Loading and Error Handling */}
        {loading && <p>Loading categories...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Display Categories */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Shop our Best Seller</h2>
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 4).map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <div className="bg-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-300 transition-colors">
                  {category.name}
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
              {/* Display Products for Each Category */}
              {categories.slice(0, 4).map((category) => (
                <div key={category.id} className="w-96 flex-shrink-0 p-4 border rounded-lg shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out">
                  <h3 className="text-lg font-semibold mb-4">{category.name}</h3>

                  {/* Scrollable Product List */}
                  <div className="overflow-x-auto flex gap-4">
                    {/* Loop through products in this category */}
                    {category.products?.slice(0, 12).map((product: ProductsType) => (
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
    </Layout>
  );
}

//export default HomePage;

