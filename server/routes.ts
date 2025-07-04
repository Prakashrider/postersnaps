import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { storage } from './storage';
import { createPosterConfigSchema, posterConfigSchema } from '@shared/schema';
import { extractMetadata } from './services/metadata';
import { generateAIContent } from './services/openai';
import { renderPoster } from './services/renderer';
import { verifyFirebaseToken } from './services/firebase';

const app = new Hono();

// Generate poster endpoint
app.post('/api/generate-poster', 
  zValidator('json', createPosterConfigSchema),
  async (c) => {
    try {
      const config = c.req.valid('json');
      
      // Check session limit for free users
      if (!config.userId) {
        const sessionCount = await storage.getSessionPosterCount(config.sessionId);
        if (sessionCount >= 1) {
          return c.json({ error: 'Free limit reached. Please sign in to continue.' }, 429);
        }
      }

      // Create poster config
      const posterConfig = await storage.createPosterConfig({
        ...config,
        status: 'processing'
      });

      // Process in background
      processPostersInBackground(posterConfig.id);

      return c.json({ 
        success: true, 
        posterId: posterConfig.id,
        message: 'Poster generation started'
      });
    } catch (error) {
      console.error('Generate poster error:', error);
      return c.json({ error: 'Failed to start poster generation' }, 500);
    }
  }
);

// Get poster status endpoint
app.get('/api/poster/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const posterConfig = await storage.getPosterConfig(id);
    
    if (!posterConfig) {
      return c.json({ error: 'Poster not found' }, 404);
    }

    return c.json(posterConfig);
  } catch (error) {
    console.error('Get poster error:', error);
    return c.json({ error: 'Failed to get poster' }, 500);
  }
});

// Extract metadata endpoint
app.post('/api/extract-metadata',
  zValidator('json', z.object({ url: z.string().url() })),
  async (c) => {
    try {
      const { url } = c.req.valid('json');
      const metadata = await extractMetadata(url);
      return c.json(metadata);
    } catch (error) {
      console.error('Extract metadata error:', error);
      return c.json({ error: 'Failed to extract metadata' }, 500);
    }
  }
);

// Check auth status endpoint
app.post('/api/check-auth',
  zValidator('json', z.object({ token: z.string().optional() })),
  async (c) => {
    try {
      const { token } = c.req.valid('json');
      
      if (!token) {
        return c.json({ authenticated: false });
      }

      const user = await verifyFirebaseToken(token);
      return c.json({ authenticated: true, user });
    } catch (error) {
      console.error('Check auth error:', error);
      return c.json({ authenticated: false });
    }
  }
);

// Get user usage endpoint
app.get('/api/user-usage/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const usage = await storage.getUserUsage(userId);
    return c.json(usage || { userId, postersCreated: 0, lastPosterCreated: new Date() });
  } catch (error) {
    console.error('Get user usage error:', error);
    return c.json({ error: 'Failed to get user usage' }, 500);
  }
});

// Background processing function
async function processPostersInBackground(posterId: string) {
  try {
    const posterConfig = await storage.getPosterConfig(posterId);
    if (!posterConfig) return;

    // Extract metadata if URL mode
    let metadata = null;
    if (posterConfig.inputMode === 'url') {
      metadata = await extractMetadata(posterConfig.inputValue);
    }

    // Generate AI content
    const aiContent = await generateAIContent({
      input: posterConfig.inputValue,
      inputMode: posterConfig.inputMode,
      style: posterConfig.style,
      contentType: posterConfig.contentType,
      metadata,
      minPages: posterConfig.minPages,
      maxPages: posterConfig.maxPages
    });

    // Render posters
    const posterUrls = await renderPoster({
      content: aiContent,
      style: posterConfig.style,
      format: posterConfig.outputFormat,
      pages: aiContent.pages
    });

    // Update poster config
    await storage.updatePosterConfig(posterId, {
      status: 'completed',
      posterUrls
    });

    // Update usage counters
    if (posterConfig.userId) {
      const usage = await storage.getUserUsage(posterConfig.userId);
      await storage.updateUserUsage(posterConfig.userId, {
        postersCreated: (usage?.postersCreated || 0) + 1,
        lastPosterCreated: new Date()
      });
    } else {
      await storage.incrementSessionPosterCount(posterConfig.sessionId);
    }

  } catch (error) {
    console.error('Background processing error:', error);
    await storage.updatePosterConfig(posterId, {
      status: 'failed',
      errorMessage: error.message
    });
  }
}

export default app;
