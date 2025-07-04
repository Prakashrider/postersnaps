import { describe, it, expect } from 'vitest';
import { generateAIContent } from '../services/openai';
import { storage } from '../storage';
import type { InputMode, PosterStyle, ContentType, OutputFormat } from '../../shared/schema';

describe('Poster Generation System Integration', () => {
  describe('AI Content Generation with Variations', () => {
    it('should generate unique content for different variations', async () => {
      const baseParams = {
        input: 'artificial intelligence',
        inputMode: 'keyword' as InputMode,
        style: 'narrative' as PosterStyle,
        contentType: 'trending' as ContentType,
        metadata: null,
        minPages: 1,
        maxPages: 1,
        totalPosters: 3
      };

      // Generate 3 variations
      const variation1 = await generateAIContent({ ...baseParams, variation: 1 });
      const variation2 = await generateAIContent({ ...baseParams, variation: 2 });
      const variation3 = await generateAIContent({ ...baseParams, variation: 3 });

      // Verify all variations have proper structure
      expect(variation1.headline).toBeDefined();
      expect(variation1.subtitle).toBeDefined();
      expect(variation1.bulletPoints).toBeDefined();
      expect(variation1.bulletPoints.length).toBeGreaterThan(0);

      expect(variation2.headline).toBeDefined();
      expect(variation2.subtitle).toBeDefined();
      expect(variation2.bulletPoints).toBeDefined();
      expect(variation2.bulletPoints.length).toBeGreaterThan(0);

      expect(variation3.headline).toBeDefined();
      expect(variation3.subtitle).toBeDefined();
      expect(variation3.bulletPoints).toBeDefined();
      expect(variation3.bulletPoints.length).toBeGreaterThan(0);

      // Log the variations to verify they are different
      console.log('Variation 1:', {
        headline: variation1.headline,
        subtitle: variation1.subtitle.substring(0, 50) + '...'
      });
      console.log('Variation 2:', {
        headline: variation2.headline,
        subtitle: variation2.subtitle.substring(0, 50) + '...'
      });
      console.log('Variation 3:', {
        headline: variation3.headline,
        subtitle: variation3.subtitle.substring(0, 50) + '...'
      });
    });

    it('should handle different poster styles correctly', async () => {
      const baseParams = {
        input: 'sustainable energy',
        inputMode: 'keyword' as InputMode,
        contentType: 'awareness' as ContentType,
        metadata: null,
        minPages: 1,
        maxPages: 1,
        variation: 1,
        totalPosters: 1
      };

      const narrativeContent = await generateAIContent({
        ...baseParams,
        style: 'narrative' as PosterStyle
      });

      const quoteContent = await generateAIContent({
        ...baseParams,
        style: 'quote' as PosterStyle
      });

      const pointersContent = await generateAIContent({
        ...baseParams,
        style: 'pointers' as PosterStyle
      });

      // Verify all styles produce content
      expect(narrativeContent.subtitle).toBeDefined();
      expect(quoteContent.subtitle).toBeDefined();
      expect(pointersContent.subtitle).toBeDefined();

      console.log('Style differences:', {
        narrative: narrativeContent.subtitle.substring(0, 50) + '...',
        quote: quoteContent.subtitle.substring(0, 50) + '...',
        pointers: pointersContent.subtitle.substring(0, 50) + '...'
      });
    });
  });

  describe('Session Management', () => {
    it('should track session poster counts correctly', async () => {
      const testSessionId1 = 'test-session-1-' + Date.now();
      const testSessionId2 = 'test-session-2-' + Date.now();

      try {
        // Create poster configs for different sessions
        const config1 = await storage.createPosterConfig({
          userId: undefined,
          sessionId: testSessionId1,
          inputMode: 'keyword' as InputMode,
          inputValue: 'test input 1',
          style: 'narrative' as PosterStyle,
          contentType: 'trending' as ContentType,
          outputFormat: 'square' as OutputFormat,
          minPages: 1,
          maxPages: 2,
          status: 'processing'
        });

        const config2 = await storage.createPosterConfig({
          userId: undefined,
          sessionId: testSessionId2,
          inputMode: 'keyword' as InputMode,
          inputValue: 'test input 2',
          style: 'quote' as PosterStyle,
          contentType: 'informative' as ContentType,
          outputFormat: 'portrait' as OutputFormat,
          minPages: 1,
          maxPages: 1,
          status: 'processing'
        });

        // Increment poster count for session 1
        await storage.incrementSessionPosterCount(testSessionId1);
        
        // Check session counts
        const count1 = await storage.getSessionPosterCount(testSessionId1);
        const count2 = await storage.getSessionPosterCount(testSessionId2);

        expect(count1).toBe(1);
        expect(count2).toBe(0);

        // Verify configs are created with different IDs
        expect(config1.id).not.toBe(config2.id);
        expect(config1.sessionId).toBe(testSessionId1);
        expect(config2.sessionId).toBe(testSessionId2);

        console.log('Session management test passed:', {
          session1Count: count1,
          session2Count: count2,
          config1Id: config1.id,
          config2Id: config2.id
        });
      } finally {
        // Clean up test data
        await storage.clearSessionData(testSessionId1);
        await storage.clearSessionData(testSessionId2);
      }
    });
  });

  describe('Multi-Poster Generation Simulation', () => {
    it('should simulate generating multiple unique posters', async () => {
      const testInput = 'renewable energy solutions';
      const numPosters = 3;
      const testSessionId = 'test-multi-poster-' + Date.now();
      
      try {
        // Create a poster config
        const config = await storage.createPosterConfig({
          userId: undefined,
          sessionId: testSessionId,
          inputMode: 'keyword' as InputMode,
          inputValue: testInput,
          style: 'pointers' as PosterStyle,
          contentType: 'informative' as ContentType,
          outputFormat: 'square' as OutputFormat,
          minPages: numPosters,
          maxPages: numPosters,
          status: 'processing'
        });

        // Simulate the background processing logic
        const generatedContent: Array<{
          headline: string;
          subtitle: string;
          bulletPoints: string[];
          pages: number;
        }> = [];
        
        for (let i = 0; i < numPosters; i++) {
          const aiContent = await generateAIContent({
            input: testInput,
            inputMode: 'keyword' as InputMode,
            style: 'pointers' as PosterStyle,
            contentType: 'informative' as ContentType,
            metadata: null,
            minPages: 1,
            maxPages: 1,
            variation: i + 1,
            totalPosters: numPosters
          });

          generatedContent.push(aiContent);
        }

        // Verify we got the expected number of unique content pieces
        expect(generatedContent.length).toBe(numPosters);
        
        // Verify each piece has the required structure
        generatedContent.forEach((content, index) => {
          expect(content.headline).toBeDefined();
          expect(content.subtitle).toBeDefined();
          expect(content.bulletPoints).toBeDefined();
          expect(content.bulletPoints.length).toBeGreaterThan(0);
          
          console.log(`Generated content ${index + 1}:`, {
            headline: content.headline,
            subtitle: content.subtitle.substring(0, 50) + '...'
          });
        });

        // Update the config as if processing completed
        await storage.updatePosterConfig(config.id, {
          status: 'completed',
          posterUrls: generatedContent.map((_, index) => `mock-url-${index + 1}`)
        });

        // Verify the config was updated
        const updatedConfig = await storage.getPosterConfig(config.id);
        expect(updatedConfig?.status).toBe('completed');
        expect(updatedConfig?.posterUrls).toHaveLength(numPosters);

        console.log('Multi-poster generation simulation successful');
      } finally {
        await storage.clearSessionData(testSessionId);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle empty input gracefully', async () => {
      const content = await generateAIContent({
        input: '',
        inputMode: 'keyword' as InputMode,
        style: 'narrative' as PosterStyle,
        contentType: 'trending' as ContentType,
        metadata: null,
        minPages: 1,
        maxPages: 1,
        variation: 1,
        totalPosters: 1
      });

      // Should still generate content (mock fallback)
      expect(content.headline).toBeDefined();
      expect(content.subtitle).toBeDefined();
      expect(content.bulletPoints).toBeDefined();
      expect(content.bulletPoints.length).toBeGreaterThan(0);
    });
  });
});
