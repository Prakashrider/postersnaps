import { Handler } from '@netlify/functions';
import { verifyFirebaseToken } from '../../../server/services/firebase';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const adminToken = authHeader?.split(' ')[1];
    
    // Verify admin access
    const admin = await verifyFirebaseToken(adminToken || '');
    const adminEmail = process.env.ADMIN_EMAIL || 'maritimeriderprakash@gmail.com';
    if (!admin || admin.email !== adminEmail) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Admin access required' }),
      };
    }
    
    // In production, you'd fetch from a proper database
    // For now, return a simple response
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Admin access granted',
        adminEmail: admin.email,
        timestamp: new Date().toISOString()
      }),
    };
  } catch (error) {
    console.error('Admin users error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch users' }),
    };
  }
};
