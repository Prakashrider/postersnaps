import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;
    
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const usage = await storage.getUserUsage(userId);
    res.json(usage || { 
      userId, 
      postersCreated: 0, 
      lastPosterCreated: new Date(),
      credits: 5,
      plan: 'free'
    });
  } catch (error) {
    console.error('Get user usage error:', error);
    res.status(500).json({ error: 'Failed to get user usage' });
  }
}