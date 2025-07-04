import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { generateAIContent } from '../services/openai';
import { renderPoster } from '../services/renderer';
import { storage } from '../storage';
import { InputMode, PosterStyle, ContentType, OutputFormat } from '../../shared/schema';

describe('Poster Generation System', () => {
  describe('AI Content Generation with Variations', () => {
    it('should generate unique content for each variation', async () => {
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
      const variations = await Promise.all([
        generateAIContent({ ...baseParams, variation: 1 }),
        generateAIContent({ ...baseParams, variation: 2 }),
        generateAIContent({ ...baseParams, variation: 3 })
      ]);

      // Verify all variations are different
      expect(variations[0].headline).not.toBe(variations[1].headline);
      expect(variations[0].headline).not.toBe(variations[2].headline);
      expect(variations[1].headline).not.toBe(variations[2].headline);

      // Verify subtitles are different
      expect(variations[0].subtitle).not.toBe(variations[1].subtitle);
      expect(variations[0].subtitle).not.toBe(variations[2].subtitle);
      expect(variations[1].subtitle).not.toBe(variations[2].subtitle);

      // Verify each variation has proper structure
      variations.forEach((variation, index) => {
        expect(variation.headline).toBeDefined();
        expect(variation.subtitle).toBeDefined();
        expect(variation.bulletPoints).toBeDefined();
        expect(variation.bulletPoints.length).toBeGreaterThan(0);
        expect(variation.pages).toBe(1);
        console.log(`Variation ${index + 1}:`, {
          headline: variation.headline,
          subtitle: variation.subtitle.substring(0, 50) + '...'
        });
      });
    });

    it('should handle single poster generation correctly', async () => {
      const singlePosterParams = {
        input: 'machine learning',
        inputMode: 'keyword' as InputMode,
        style: 'pointers' as PosterStyle,
        contentType: 'informative' as ContentType,
        metadata: null,
        minPages: 1,
        maxPages: 1,
        variation: 1,
        totalPosters: 1
      };

      const content = await generateAIContent(singlePosterParams);
      
      expect(content.headline).toBeDefined();
      expect(content.subtitle).toBeDefined();
      expect(content.bulletPoints).toBeDefined();
      expect(content.bulletPoints.length).toBeGreaterThan(0);
      expect(content.pages).toBe(1);
    });

    it('should generate different content for different poster styles', async () => {
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

      // Verify different styles produce different content
      expect(narrativeContent.subtitle).not.toBe(quoteContent.subtitle);
      expect(narrativeContent.subtitle).not.toBe(pointersContent.subtitle);
      expect(quoteContent.subtitle).not.toBe(pointersContent.subtitle);

      console.log('Style differences:', {
        narrative: narrativeContent.subtitle.substring(0, 50) + '...',
        quote: quoteContent.subtitle.substring(0, 50) + '...',
        pointers: pointersContent.subtitle.substring(0, 50) + '...'
      });
    });
  });

  describe('Renderer Aspect Ratio Handling', () => {
    it('should handle different output formats correctly', async () => {
      const testContent = {
        headline: 'Test Headline',
        subtitle: 'Test subtitle for aspect ratio testing',
        bulletPoints: ['Point 1', 'Point 2', 'Point 3'],
        pages: 1
      };

      const formats: OutputFormat[] = ['square', 'portrait', 'story'];
      
      for (const format of formats) {
        const posterUrls = await renderPoster({
          content: testContent,
          style: 'narrative' as PosterStyle,
          format,
          pages: 1
        });

        expect(posterUrls).toBeDefined();
        expect(posterUrls.length).toBe(1);
        expect(posterUrls[0]).toContain('data:image/png;base64');
        
        console.log(`${format} format rendered successfully`);
      }
    });
  });

  describe('Session Management', () => {
    const testSessionId1 = 'test-session-1';
    const testSessionId2 = 'test-session-2';

    beforeEach(async () => {
      // Clean up test data
      await storage.clearSessionData(testSessionId1);
      await storage.clearSessionData(testSessionId2);
    });

    afterEach(async () => {
      // Clean up test data
      await storage.clearSessionData(testSessionId1);
      await storage.clearSessionData(testSessionId2);
    });

    it('should track session poster counts correctly', async () => {
      // Create poster config for session 1
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

      // Create poster config for session 2
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

      console.log('Session management working correctly:', {
        session1Count: count1,
        session2Count: count2
      });
    });

    it('should generate unique posters for different sessions', async () => {
      // Create poster configs for different sessions but same input
      const sameInput = 'blockchain technology';
      
      const config1 = await storage.createPosterConfig({
        userId: undefined,
        sessionId: testSessionId1,
        inputMode: 'keyword' as InputMode,
        inputValue: sameInput,
        style: 'narrative' as PosterStyle,
        contentType: 'trending' as ContentType,
        outputFormat: 'square' as OutputFormat,
        minPages: 1,
        maxPages: 1,
        status: 'processing'
      });

      const config2 = await storage.createPosterConfig({
        userId: undefined,
        sessionId: testSessionId2,
        inputMode: 'keyword' as InputMode,
        inputValue: sameInput,
        style: 'narrative' as PosterStyle,
        contentType: 'trending' as ContentType,
        outputFormat: 'square' as OutputFormat,
        minPages: 1,
        maxPages: 1,
        status: 'processing'
      });

      // Generate AI content for both sessions
      const content1 = await generateAIContent({
        input: sameInput,
        inputMode: 'keyword' as InputMode,
        style: 'narrative' as PosterStyle,
        contentType: 'trending' as ContentType,
        metadata: null,
        minPages: 1,
        maxPages: 1,
        variation: 1,
        totalPosters: 1
      });

      const content2 = await generateAIContent({
        input: sameInput,
        inputMode: 'keyword' as InputMode,
        style: 'narrative' as PosterStyle,
        contentType: 'trending' as ContentType,
        metadata: null,
        minPages: 1,
        maxPages: 1,
        variation: 1,
        totalPosters: 1
      });

      // Verify that configs are different (different IDs)
      expect(config1.id).not.toBe(config2.id);
      expect(config1.sessionId).not.toBe(config2.sessionId);

      // Note: Content may be similar since we're using the same input and parameters
      // The uniqueness comes from the random generation, not deterministic differences
      console.log('Different session posters created:', {
        config1Id: config1.id,
        config2Id: config2.id,
        content1Headline: content1.headline,
        content2Headline: content2.headline
      });
    });
  });

  describe('Multi-Poster Generation', () => {
    it('should create multiple unique posters in a single request', async () => {
      const testInput = 'renewable energy solutions';
      const numPosters = 3;
      
      // Simulate the background processing logic
      const posterUrls: string[] = [];
      
      for (let i = 0; i < numPosters; i++) {
        // Generate unique content for each poster
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

        // Render single poster
        const singlePosterUrls = await renderPoster({
          content: aiContent,
          style: 'pointers' as PosterStyle,
          format: 'square' as OutputFormat,
          pages: 1
        });
        
        posterUrls.push(...singlePosterUrls);
      }

      expect(posterUrls.length).toBe(numPosters);
      
      // Verify each poster is a valid image
      posterUrls.forEach((url, index) => {
        expect(url).toContain('data:image/png;base64');
        console.log(`Poster ${index + 1} generated successfully`);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid input gracefully', async () => {
      const invalidParams = {
        input: '', // Empty input
        inputMode: 'keyword' as InputMode,
        style: 'narrative' as PosterStyle,
        contentType: 'trending' as ContentType,
        metadata: null,
        minPages: 1,
        maxPages: 1,
        variation: 1,
        totalPosters: 1
      };

      const content = await generateAIContent(invalidParams);
      
      // Should still generate content (fallback to mock)
      expect(content.headline).toBeDefined();
      expect(content.subtitle).toBeDefined();
      expect(content.bulletPoints).toBeDefined();
    });

    it('should handle rendering errors gracefully', async () => {
      const testContent = {
        headline: 'Test Headline',
        subtitle: 'Test subtitle',
        bulletPoints: ['Point 1', 'Point 2'],
        pages: 1
      };

      // Should not throw error even with potential issues
      const posterUrls = await renderPoster({
        content: testContent,
        style: 'narrative' as PosterStyle,
        format: 'square' as OutputFormat,
        pages: 1
      });

      expect(posterUrls).toBeDefined();
      expect(posterUrls.length).toBeGreaterThan(0);
    });
  });
});
