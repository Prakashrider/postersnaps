import { Handler } from '@netlify/functions';
import { z } from 'zod';
import { extractMetadata } from '../../server/services/metadata';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const urlSchema = z.object({ url: z.string().url() });
    const body = JSON.parse(event.body || '{}');
    const result = urlSchema.safeParse(body);
    
    if (!result.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid URL' }),
      };
    }
    
    const { url } = result.data;
    const metadata = await extractMetadata(url);
    return {
      statusCode: 200,
      body: JSON.stringify(metadata),
    };
  } catch (error) {
    console.error('Extract metadata error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to extract metadata' }),
    };
  }
};
