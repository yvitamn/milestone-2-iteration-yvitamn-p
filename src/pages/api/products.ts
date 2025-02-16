import { NextApiRequest, NextApiResponse } from 'next';

import NodeCache from 'node-cache';
import { handleResponse, ApiError, handleApiError } from '@/lib/api';

const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

export default async function handler(_: unknown, res: NextApiResponse) {
  const cacheKey = 'all-products';

  // Check if data is cached
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log('Serving from cache');
    return res.status(200).json(cachedData);
  }
try {
  // Fetch data from the external API or database
  const response = await fetch('https://api.escuelajs.co/api/v1/products');
  const data = await handleResponse(response);
  
  // Cache the data
  cache.set(cacheKey, data);

  // Return the response
  res.status(200).json(data);
} catch (error: unknown) {
    console.error('Error fetching products:', error);

    // Use handleApiError to properly process any caught error
    await handleApiError(error);

    // Fallback response
    res.status(500).json({ message: 'Error fetching products', error: error instanceof ApiError ? error.message : 'Unknown error' });
  }
}