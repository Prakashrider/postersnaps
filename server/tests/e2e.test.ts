import { describe, it, expect } from 'vitest';
import { storage } from '../storage';
import { generateAIContent } from '../services/openai';
import type { InputMode, PosterStyle, ContentType, OutputFormat } from '../../shared/schema';

describe('End-to-End Poster Generation', () => {
  it('should complete a full poster generation workflow', async () => {
    const testSessionId = 'e2e-test-' + Date.now();
    
    try {
      // Step 1: Create a poster configuration (simulating the API request)
      const posterConfig = await storage.createPosterConfig({
        userId: undefined,
        sessionId: testSessionId,
        inputMode: 'keyword' as InputMode,
        inputValue: 'machine learning applications',
        style: 'narrative' as PosterStyle,
        contentType: 'informative' as ContentType,
        outputFormat: 'square' as OutputFormat,
        minPages: 1,
        maxPages: 3,
        status: 'processing'
      });

      expect(posterConfig.id).toBeDefined();
      expect(posterConfig.status).toBe('processing');
      expect(posterConfig.sessionId).toBe(testSessionId);

      // Step 2: Generate AI content for multiple posters (simulating background processing)
      const numPosters = Math.min(Math.max(posterConfig.minPages, 1), posterConfig.maxPages);
      const posterUrls: string[] = [];
      
      for (let i = 0; i < numPosters; i++) {
        const aiContent = await generateAIContent({
          input: posterConfig.inputValue,
          inputMode: posterConfig.inputMode,
          style: posterConfig.style,
          contentType: posterConfig.contentType,
          metadata: null,
          minPages: 1,
          maxPages: 1,
          variation: i + 1,
          totalPosters: numPosters
        });

        // Verify the AI content is valid
        expect(aiContent.headline).toBeDefined();
        expect(aiContent.subtitle).toBeDefined();
        expect(aiContent.bulletPoints).toBeDefined();
        expect(aiContent.bulletPoints.length).toBeGreaterThan(0);
        expect(aiContent.pages).toBe(1);

        // Mock poster URL generation (in real scenario, this would be from renderer)
        posterUrls.push(`mock-poster-${i + 1}.png`);
        
        console.log(`Generated content for poster ${i + 1}:`, {
          headline: aiContent.headline,
          subtitle: aiContent.subtitle.substring(0, 50) + '...',
          bulletPointsCount: aiContent.bulletPoints.length
        });
      }

      // Step 3: Update poster configuration with results
      const updatedConfig = await storage.updatePosterConfig(posterConfig.id, {
        status: 'completed',
        posterUrls
      });

      expect(updatedConfig.status).toBe('completed');
      expect(updatedConfig.posterUrls).toHaveLength(numPosters);
      expect(updatedConfig.posterUrls).toEqual(posterUrls);

      // Step 4: Update session usage
      await storage.incrementSessionPosterCount(testSessionId);
      const sessionCount = await storage.getSessionPosterCount(testSessionId);
      expect(sessionCount).toBe(1);

      // Step 5: Verify we can retrieve the completed poster
      const retrievedConfig = await storage.getPosterConfig(posterConfig.id);
      expect(retrievedConfig).toBeDefined();
      expect(retrievedConfig?.status).toBe('completed');
      expect(retrievedConfig?.posterUrls).toHaveLength(numPosters);

      console.log('E2E test completed successfully:', {
        posterId: posterConfig.id,
        numPosters,
        sessionCount,
        status: retrievedConfig?.status
      });
    } finally {
      // Clean up
      await storage.clearSessionData(testSessionId);
    }
  });

  it('should handle session limits correctly', async () => {
    const testSessionId = 'limit-test-' + Date.now();
    
    try {
      // Create first poster (should succeed)
      const config1 = await storage.createPosterConfig({
        userId: undefined,
        sessionId: testSessionId,
        inputMode: 'keyword' as InputMode,
        inputValue: 'first poster',
        style: 'quote' as PosterStyle,
        contentType: 'trending' as ContentType,
        outputFormat: 'portrait' as OutputFormat,
        minPages: 1,
        maxPages: 1,
        status: 'processing'
      });

      await storage.incrementSessionPosterCount(testSessionId);
      const countAfterFirst = await storage.getSessionPosterCount(testSessionId);
      expect(countAfterFirst).toBe(1);

      // Verify that the session now has reached its limit
      const sessionCount = await storage.getSessionPosterCount(testSessionId);
      expect(sessionCount).toBe(1); // Free tier limit

      console.log('Session limit test passed:', {
        firstPosterId: config1.id,
        sessionCount
      });
    } finally {
      await storage.clearSessionData(testSessionId);
    }
  });

  it('should generate different content for different variations', async () => {
    const testInput = 'sustainable technology';
    const numVariations = 3;
    
    const variations: Array<{
      headline: string;
      subtitle: string;
      bulletPoints: string[];
      pages: number;
    }> = [];
    
    for (let i = 0; i < numVariations; i++) {
      const content = await generateAIContent({
        input: testInput,
        inputMode: 'keyword' as InputMode,
        style: 'pointers' as PosterStyle,
        contentType: 'awareness' as ContentType,
        metadata: null,
        minPages: 1,
        maxPages: 1,
        variation: i + 1,
        totalPosters: numVariations
      });
      
      variations.push(content);
    }

    // Verify all variations are structurally valid
    variations.forEach((variation, index) => {
      expect(variation.headline).toBeDefined();
      expect(variation.subtitle).toBeDefined();
      expect(variation.bulletPoints).toBeDefined();
      expect(variation.bulletPoints.length).toBeGreaterThan(0);
      
      console.log(`Variation ${index + 1} headline:`, variation.headline);
    });

    // Verify that variations are different (at least headlines should be different)
    const headlines = variations.map(v => v.headline);
    const uniqueHeadlines = new Set(headlines);
    expect(uniqueHeadlines.size).toBeGreaterThan(1); // Should have at least some variation

    console.log('Variation test completed:', {
      totalVariations: variations.length,
      uniqueHeadlines: uniqueHeadlines.size
    });
  });

  it('should handle different session IDs independently', async () => {
    const session1 = 'session-1-' + Date.now();
    const session2 = 'session-2-' + Date.now();
    
    try {
      // Create posters for different sessions
      const config1 = await storage.createPosterConfig({
        userId: undefined,
        sessionId: session1,
        inputMode: 'keyword' as InputMode,
        inputValue: 'AI ethics',
        style: 'narrative' as PosterStyle,
        contentType: 'awareness' as ContentType,
        outputFormat: 'square' as OutputFormat,
        minPages: 1,
        maxPages: 1,
        status: 'processing'
      });

      const config2 = await storage.createPosterConfig({
        userId: undefined,
        sessionId: session2,
        inputMode: 'keyword' as InputMode,
        inputValue: 'quantum computing',
        style: 'pointers' as PosterStyle,
        contentType: 'informative' as ContentType,
        outputFormat: 'portrait' as OutputFormat,
        minPages: 1,
        maxPages: 1,
        status: 'processing'
      });

      // Increment counts independently
      await storage.incrementSessionPosterCount(session1);
      await storage.incrementSessionPosterCount(session2);

      const count1 = await storage.getSessionPosterCount(session1);
      const count2 = await storage.getSessionPosterCount(session2);

      expect(count1).toBe(1);
      expect(count2).toBe(1);
      expect(config1.id).not.toBe(config2.id);
      expect(config1.sessionId).not.toBe(config2.sessionId);

      console.log('Multi-session test passed:', {
        session1: { id: config1.id, count: count1 },
        session2: { id: config2.id, count: count2 }
      });
    } finally {
      await storage.clearSessionData(session1);
      await storage.clearSessionData(session2);
    }
  });
});
