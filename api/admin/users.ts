import { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyFirebaseToken } from '../../server/services/firebase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const adminToken = req.headers.authorization?.split(' ')[1];
    
    // Verify admin access
    const admin = await verifyFirebaseToken(adminToken || '');
    const adminEmail = process.env.ADMIN_EMAIL || 'maritimeriderprakash@gmail.com';
    if (!admin || admin.email !== adminEmail) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    // In production, you'd fetch from a proper database
    // For now, return a simple response
    res.json({ 
      message: 'Admin access granted',
      adminEmail: admin.email,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}
