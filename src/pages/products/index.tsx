import { fetchProductDetails, fetchProducts } from "@/lib/api";
import ProductDetails from "@/components/ProductDetails";

import { ProductsType } from "@/lib/types"; 



interface ProductPageProps {
  params: {
    id: string;
  };
}

// This function is used for static generation (SSG)
export async function generateStaticParams() {
  try{
  // Fetch all products 
  const products: ProductsType[] = await fetchProducts();
  
  // Return the list of product IDs as params for static generation
  return products.map((product) => ({
    id: product.id.toString(),
  }));
} catch (error) {
  console.error("Error fetching products for static params:", error);
  return [];
}
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    // Convert the params.id to a number, assuming product IDs are numeric
    // const productId = parseInt(params.id, 10);

    // if (isNaN(productId)) {
    //   return <div>Invalid product ID.</div>;
    // }
  
  // Fetch the product details by its ID
  const product = await fetchProductDetails(parseInt(params.id));

  // if (!product) {
  //   return <div>Product not found.</div>;
  // }

  // Render the product details component
  return <ProductDetails product={product} />;
} catch (error) {
  console.error("Error fetching product details:", error);
  return <div>Failed to load product details.</div>;
}
}