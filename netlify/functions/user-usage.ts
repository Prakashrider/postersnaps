import { Handler } from '@netlify/functions';
import { storage } from '../../server/storage';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Extract the userId from query parameters (supports /api/user-usage?userId={userId})
    const userId = event.queryStringParameters?.userId;
    
    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User ID is required' }),
      };
    }

    const usage = await storage.getUserUsage(userId);
    return {
      statusCode: 200,
      body: JSON.stringify(usage || { 
        userId, 
        postersCreated: 0, 
        lastPosterCreated: new Date(),
        credits: 5,
        plan: 'free'
      }),
    };
  } catch (error) {
    console.error('Get user usage error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get user usage' }),
    };
  }
};
