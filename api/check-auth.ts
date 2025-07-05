import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { verifyFirebaseToken } from '../server/services/firebase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authSchema = z.object({ token: z.string().optional() });
    const result = authSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    
    const { token } = result.data;
    
    if (!token) {
      return res.json({ authenticated: false });
    }

    const user = await verifyFirebaseToken(token);
    res.json({ authenticated: true, user });
  } catch (error) {
    console.error('Check auth error:', error);
    res.json({ authenticated: false });
  }
}