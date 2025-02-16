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
  // Fetch all products 
  const products: ProductsType[] = await fetchProducts();
  
  // Return the list of product IDs as params for static generation
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Fetch the product details by its ID
  const product = await fetchProductDetails(params.id);

  // Render the product details component
  return <ProductDetails product={product} />;
}