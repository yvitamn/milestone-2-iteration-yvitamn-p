import { NextApiRequest, NextApiResponse } from 'next';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cacheKey = 'all-products';

  // Check if data is cached
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log('Serving from cache');
    return res.status(200).json(cachedData);
  }

  // Fetch data from the external API or database
  const response = await fetch('https://api.escuelajs.co/api/v1');
  const data = await response.json();

  // Cache the data
  cache.set(cacheKey, data);

  // Return the response
  res.status(200).json(data);
}