import { Router } from 'express';
import { z } from 'zod';
import { storage } from './storage';
import { createPosterConfigSchema } from '@shared/schema';
import { extractMetadata } from './services/metadata';
import { generateAIContent } from './services/openai';
import { renderPoster } from './services/renderer';
import { verifyFirebaseToken } from './services/firebase';

const router = Router();

// Generate poster endpoint
router.post('/generate-poster', async (req, res) => {
  try {
    const result = createPosterConfigSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request data', details: result.error.errors });
    }
    
    const config = result.data;
    
    // Check session limit for free users
    if (!config.userId) {
      const sessionCount = await storage.getSessionPosterCount(config.sessionId);
      if (sessionCount >= 1) {
        return res.status(429).json({ error: 'Free limit reached. Please sign in to continue.' });
      }
    }

    // Create poster config
    const posterConfig = await storage.createPosterConfig({
      ...config,
      status: 'processing'
    });

    // Process in background
    processPostersInBackground(posterConfig.id);

    res.json({ 
      success: true, 
      posterId: posterConfig.id,
      message: 'Poster generation started'
    });
  } catch (error) {
    console.error('Generate poster error:', error);
    res.status(500).json({ error: 'Failed to start poster generation' });
  }
});

// Get poster status endpoint
router.get('/poster/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const posterConfig = await storage.getPosterConfig(id);
    
    if (!posterConfig) {
      return res.status(404).json({ error: 'Poster not found' });
    }

    res.json(posterConfig);
  } catch (error) {
    console.error('Get poster error:', error);
    res.status(500).json({ error: 'Failed to get poster' });
  }
});

// Extract metadata endpoint
router.post('/extract-metadata', async (req, res) => {
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
});

// Check auth status endpoint
router.post('/check-auth', async (req, res) => {
  try {
    const authSchema = z.object({ token: z.string().optional() });
    const result = authSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ error: 'Invalid request' });
    }
    
    const { token } = result.data;
    
    if (!token) {
      return res.json({ authenticated: false });
    }

    const user = await verifyFirebaseToken(token);
    res.json({ authenticated: true, user });
  } catch (error) {
    console.error('Check auth error:', error);
    res.json({ authenticated: false });
  }
});

// Get user usage endpoint
router.get('/user-usage/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const usage = await storage.getUserUsage(userId);
    res.json(usage || { userId, postersCreated: 0, lastPosterCreated: new Date() });
  } catch (error) {
    console.error('Get user usage error:', error);
    res.status(500).json({ error: 'Failed to get user usage' });
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
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export default router;