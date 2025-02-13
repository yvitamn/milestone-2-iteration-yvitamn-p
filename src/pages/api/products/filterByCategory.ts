
import { NextApiRequest, NextApiResponse } from 'next';
import { fetchProducts } from '@/lib/api'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get the categoryId query parameter from the request
    const { categoryId } = req.query;

    // Validate the categoryId parameter
    if (!categoryId) {
      return res.status(400).json({ error: 'categoryId query parameter is required' });
    }

    // Fetch all products
    const products = await fetchProducts(); // Replace with actual API call if needed

    if (!Array.isArray(products)) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    // Filter products by categoryId
    const filteredProducts = products.filter((product) => product.category.id === parseInt(categoryId as string));

    // Return the filtered products
    res.status(200).json(filteredProducts);
  } catch (error) {
    console.error('Error filtering products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
