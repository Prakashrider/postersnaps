import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Poster ID is required' });
    }

    const posterConfig = await storage.getPosterConfig(id);
    
    if (!posterConfig) {
      return res.status(404).json({ error: 'Poster not found' });
    }

    res.json(posterConfig);
  } catch (error) {
    console.error('Get poster error:', error);
    res.status(500).json({ error: 'Failed to get poster' });
  }
}