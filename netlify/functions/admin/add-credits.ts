import { Handler } from '@netlify/functions';
import { neonStorage } from '../../../client/src/lib/storage.neon';
import { verifyFirebaseToken } from '../../../server/services/firebase';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { adminToken, userId, credits } = JSON.parse(event.body || '{}');
    
    // Verify admin access
    const admin = await verifyFirebaseToken(adminToken);
    const adminEmail = process.env.ADMIN_EMAIL || 'maritimeriderprakash@gmail.com';
    if (!admin || admin.email !== adminEmail) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Admin access required' }),
      };
    }
    
    const updatedUsage = await neonStorage.addCredits(userId, credits);
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: `${credits} credits added to user ${userId}`,
        newBalance: updatedUsage.credits
      }),
    };
  } catch (error) {
    console.error('Admin add credits error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add credits' }),
    };
  }
};
