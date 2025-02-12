// // Assuming you have a way to retrieve the Access Token (e.g., from localStorage or cookies)
// const getAccessToken = (): string | null => {
//     // Example: Get token from localStorage or any storage method you're using
//     return localStorage.getItem('access_token') || null;
//   };
  
//   // Function to fetch all products with Access Token for Authorization
//   export const fetchProducts = async (): Promise<ProductsType[]> => {
//     const token = getAccessToken(); // Get access token (if available)
  
//     try {
//       const response = await fetch(`${BASE_URL}/products`, {
//         headers: {
//           Authorization: token ? `Bearer ${token}` : '', // Include access token in Authorization header
//         },
//       });
  
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
  
//       const data = await response.json();
  
//       // Ensure that the response is an array and has the necessary properties
//       if (
//         !Array.isArray(data) ||
//         !data.every(
//           (product) =>
//             product.id &&
//             product.title &&
//             product.price &&
//             product.images?.length > 0
//         )
//       ) {
//         throw new Error('Invalid data format');
//       }
  
//       // Adding a default quantity to each product
//       return data.map((product) => ({
//         id: product.id,
//         title: product.title,
//         description: product.description,
//         price: product.price,
//         imageUrl: product.images[0], // Use the first image in the images array
//         quantity: 1, // Set default quantity to 1
//       }));
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       throw error;
//     }
//   };
  
//   // Function to fetch a single product by ID with Access Token for Authorization
//   export const fetchProductDetails = async (id: string): Promise<ProductsType> => {
//     const token = getAccessToken(); // Get access token (if available)
  
//     try {
//       const response = await fetch(`${BASE_URL}/products/${id}`, {
//         headers: {
//           Authorization: token ? `Bearer ${token}` : '', // Include access token in Authorization header
//         },
//       });
  
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
  
//       const data = await response.json();
  
//       // Ensure that the response contains valid product data
//       if (!data.id || !data.title || !data.price || !data.images) {
//         console.log('data', data);
//         throw new Error('Invalid product data format');
//       }
  
//       return {
//         id: data.id,
//         title: data.title,
//         description: data.description,
//         price: data.price,
//         quantity: 1, // Set default quantity to 1
//         imageUrl: data.images[0], // Use imageUrl as per your interface
//       };
//     } catch (error) {
//       console.error('Error fetching product details:', error);
//       throw error;
//     }
//   };
  