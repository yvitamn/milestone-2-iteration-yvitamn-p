import { NextApiRequest, NextApiResponse } from 'next';

// Mocked fetch from external API
const fetchProducts = async (categoryId: number | string, limit: number) => {
  const response = await fetch(`https://api.escuelajs.co/api/v1/products?categoryId=${categoryId}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { categoryId, limit } = req.query;

    // Validate the query parameters
    if (!categoryId || !limit) {
      return res.status(400).json({ error: 'Missing categoryId or limit' });
    }

    // Ensure categoryId and limit are of the correct types (string for categoryId, number for limit)
    if (typeof categoryId !== 'string' || isNaN(Number(limit))) {
     return res.status(400).json({ error: 'Invalid categoryId or limit' });
      }

    // Fetch the products
    const products = await fetchProducts(categoryId as string, parseInt(limit as string));

    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}