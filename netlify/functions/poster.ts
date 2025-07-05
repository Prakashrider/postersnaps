import { Handler } from '@netlify/functions';
import { storage } from '../../server/storage';

export const handler: Handler = async (event) => {
  console.log('🔍 Poster function called with:', {
    method: event.httpMethod,
    path: event.path,
    queryStringParameters: event.queryStringParameters
  });
  
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Extract the ID from query parameters (supports /api/poster?id={id})
    const posterId = event.queryStringParameters?.id;
    console.log('📋 Extracted poster ID:', posterId);

    if (!posterId) {
      console.log('❌ No poster ID provided');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Poster ID is required' }),
      };
    }

    console.log('🔍 Looking up poster config for ID:', posterId);
    const posterConfig = await storage.getPosterConfig(posterId);
    console.log('📊 Poster config result:', posterConfig ? 'Found' : 'Not found');

    if (!posterConfig) {
      console.log('❌ Poster not found in storage');
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Poster not found' }),
      };
    }

    console.log('✅ Returning poster config');
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(posterConfig),
    };
  } catch (error) {
    console.error('Get poster error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get poster' }),
    };
  }
};
