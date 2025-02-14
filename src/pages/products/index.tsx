import { fetchProducts, fetchProductDetails } from "@/lib/api";

import { ProductsType } from "@/lib/types";
import ProductDetail from ./productDetail;

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const products: Product[] = await getProducts(0, 100);
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await fetchProductDetails(parseInt(params.id));
  return <ProductDetail product={product}/>;