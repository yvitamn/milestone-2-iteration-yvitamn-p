// import { useEffect, useState } from 'react';
// import { ProductsType } from '@/lib/types'; // Import Product type

// export const useProducts = () => {
//   const [products, setProducts] = useState<ProductsType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch('/api/products'); // Fetch products from the backend
//         const data: ProductsType[] = await response.json(); // Parse the response as JSON

//         // Transform the data into Product objects
//         // const transformedProducts: TransformedProduct[] = data.map((product) => ({
//         //   id: product.id,
//         //   title: product.title,
//         //   description: product.description,
//         //   price: product.price,
//         //   imageUrl: product.imageUrl,
//         //   quantity: product.quantity || 1, // Default quantity to 1 if not provided
//         //   category: product.category, // Include category
//         // }));

//        // setProducts(transformedProducts); // Update state with the transformed products
//       } catch (error) {
//         console.error('Error fetching products:', error);
//         setError('Failed to fetch products');
//     } finally {
//       setLoading(false);
//     }
//   };

//     fetchProducts(); // Call the fetch function
//   }, []);

//   return { products, loading, error };  // Return the products
// };