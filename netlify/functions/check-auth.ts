import { Handler } from '@netlify/functions';
import { z } from 'zod';
import { verifyFirebaseToken } from '../../server/services/firebase';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const authSchema = z.object({ token: z.string().optional() });
    const body = JSON.parse(event.body || '{}');
    const result = authSchema.safeParse(body);
    
    if (!result.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request' }),
      };
    }
    
    const { token } = result.data;
    
    if (!token) {
      return {
        statusCode: 200,
        body: JSON.stringify({ authenticated: false }),
      };
    }

    const user = await verifyFirebaseToken(token);
    return {
      statusCode: 200,
      body: JSON.stringify({ authenticated: true, user }),
    };
  } catch (error) {
    console.error('Check auth error:', error);
    return {
      statusCode: 200,
      body: JSON.stringify({ authenticated: false }),
    };
  }
};
