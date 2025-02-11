// import Link from 'next/link';
// import { ProductsType } from '@/lib/types';
// import useCart from '@/hooks/useCart';

// interface ProductDetailProps {
//   product: ProductsType;
//   backLink: string;
//   backLinkText: string;
//   onAddToCart: () => void;
// }

// export const ProductDetail = ({ product, onAddToCart, backLink, backLinkText }: ProductDetailProps) => {
//     const { addProductToCart } = useCart();

//     // Handler to add product to cart and open the modal
//     const handleAddToCart = () => {
//       if (product) {
//         addProductToCart(product);  // Directly add the entire product object
//         onAddToCart(); // Open the modal when product is added
//       }
//     };
  
//     return (
//     <div className="container mx-auto p-6">
//       <Link href={backLink}>
//         <a className="back-button mb-6">{backLinkText}</a>
//       </Link>
//       <h2 className="text-4xl font-bold mb-6">{product.title}</h2>
//       {product.imageUrl && product.imageUrl[0] && (
//         <img
//           src={product.images[0]}
//           alt={product.title}
//           className="w-full h-auto aspect-square object-cover rounded-lg"
//         />
//       )}
//       <p className="text-lg mb-4">{product.description}</p>
//       <p className="text-xl font-semibold mb-4">${product.price}</p>
//       <button
//         onClick={handleAddToCart}
//         disabled={!product} // Disable if product is not loaded
//         className="bg-blue-500
//                   text-white py-2 
//                   px-6 rounded-md
//                   hover:bg-blue-600
//                   disabled:bg-gray-300 
//                   disabled:cursor-not-allowed"
//         aria-label="Add to Cart"
//         role="button"
//         tabIndex={0}
//       >
//         Add to Cart
//       </button>
//     </div>
//   );
// };