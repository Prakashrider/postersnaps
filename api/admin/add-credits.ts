import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../server/storage';
import { verifyFirebaseToken } from '../../server/services/firebase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { adminToken, userId, credits } = req.body;
    
    // Verify admin access
    const admin = await verifyFirebaseToken(adminToken);
    const adminEmail = process.env.ADMIN_EMAIL || 'maritimeriderprakash@gmail.com';
    if (!admin || admin.email !== adminEmail) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const updatedUsage = await storage.addCredits(userId, credits);
    res.json({ 
      success: true, 
      message: `${credits} credits added to user ${userId}`,
      newBalance: updatedUsage.credits
    });
  } catch (error) {
    console.error('Admin add credits error:', error);
    res.status(500).json({ error: 'Failed to add credits' });
  }
}
