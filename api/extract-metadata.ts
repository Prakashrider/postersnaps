import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { extractMetadata } from '../server/services/metadata';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const urlSchema = z.object({ url: z.string().url() });
    const result = urlSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid URL' });
    }
    
    const { url } = result.data;
    const metadata = await extractMetadata(url);
    res.json(metadata);
  } catch (error) {
    console.error('Extract metadata error:', error);
    res.status(500).json({ error: 'Failed to extract metadata' });
  }
}