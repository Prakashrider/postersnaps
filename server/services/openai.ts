import OpenAI from 'openai';
import { PosterStyle, ContentType, InputMode, Metadata, AIContent } from '@shared/schema';

// Check if OpenAI is configured
const isOpenAIConfigured = !!(process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY);

const openai = isOpenAIConfigured ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY
}) : null;

interface GenerateContentParams {
  input: string;
  inputMode: InputMode;
  style: PosterStyle;
  contentType: ContentType;
  metadata?: Metadata | null;
  minPages: number;
  maxPages: number;
  variation?: number;
  totalPosters?: number;
}

// Mock AI content for development
function generateMockContent(params: GenerateContentParams): AIContent {
  const { input, style, contentType, minPages, maxPages, variation = 1, totalPosters = 1 } = params;
  
  const pages = Math.min(Math.max(minPages, 1), maxPages);
  
  // Create variation-specific content
  const variationSuffixes = [
    '', // Variation 1 - base
    ' - Advanced Guide', // Variation 2
    ' - Expert Tips', // Variation 3  
    ' - Pro Strategies', // Variation 4
    ' - Master Class' // Variation 5
  ];
  
  const variationFocus = [
    'fundamentals and basics',
    'advanced techniques and strategies', 
    'expert insights and best practices',
    'professional applications and use cases',
    'mastery and optimization'
  ];
  
  const currentVariation = Math.min(variation - 1, variationSuffixes.length - 1);
  const suffix = totalPosters > 1 ? variationSuffixes[currentVariation] : '';
  const focus = variationFocus[currentVariation];
  
  // Create style and content type specific variations
  let headlinePrefix = '';
  let subtitleStyle = '';
  let bulletPointStyle = [];
  
  // Content type specific headlines
  switch (contentType) {
    case 'trending':
      headlinePrefix = '🔥 TRENDING: ';
      break;
    case 'awareness':
      headlinePrefix = '🌟 AWARENESS: ';
      break;
    case 'informative':
      headlinePrefix = '📚 LEARN: ';
      break;
  }
  
  // Style specific subtitles and bullet points
  switch (style) {
    case 'narrative':
      subtitleStyle = `Discover the fascinating story behind ${input} and its impact on ${focus}.`;
      bulletPointStyle = [
        `The journey of ${input} through history`,
        `How ${input} transformed our world`,
        `Personal stories about ${input}`,
        `The future narrative of ${input}`,
        `Your role in the ${input} story`
      ];
      break;
    case 'quote':
      subtitleStyle = `"${input} is not just a concept, it's a revolution that changes everything about ${focus}."`;
      bulletPointStyle = [
        `"Innovation in ${input} starts with belief"`,
        `"The power of ${input} lies in its potential"`,
        `"Success with ${input} requires dedication"`,
        `"${input} transforms those who embrace it"`,
        `"The future belongs to ${input} pioneers"`
      ];
      break;
    case 'pointers':
      subtitleStyle = `Essential insights and actionable steps for mastering ${input} in today's world.`;
      bulletPointStyle = [
        `✓ Key principles of ${input}`,
        `✓ Step-by-step implementation guide`,
        `✓ Common mistakes to avoid`,
        `✓ Best practices for ${input}`,
        `✓ Resources for continued learning`
      ];
      break;
  }
  
  return {
    headline: `${headlinePrefix}${input}${suffix}`,
    subtitle: subtitleStyle,
    bulletPoints: bulletPointStyle.slice(0, 5),
    pages
  };
}

export async function generateAIContent(params: GenerateContentParams): Promise<AIContent> {
  const { input, inputMode, style, contentType, metadata, minPages, maxPages, variation = 1, totalPosters = 1 } = params;
  
  console.log('🎨 Generating AI content with params:', JSON.stringify({
    input,
    style,
    contentType,
    variation,
    totalPosters
  }, null, 2));

  // If OpenAI is not configured, use mock data
  if (!isOpenAIConfigured || !openai) {
    console.log('⚠️ OpenAI not configured, using mock content');
    return generateMockContent(params);
  }

  console.log(`🤖 Generating AI content with OpenAI for: ${input} (Variation ${variation}/${totalPosters})`);
  
  // Build context from input and metadata
  let context = '';
  if (inputMode === 'keyword') {
    context = `Topic: ${input}`;
  } else if (inputMode === 'url' && metadata) {
    context = `URL: ${input}\nTitle: ${metadata.title || 'N/A'}\nDescription: ${metadata.description || 'N/A'}`;
  } else {
    context = `Content: ${input}`;
  }

  // Build style-specific prompt
  let stylePrompt = '';
  switch (style) {
    case 'narrative':
      stylePrompt = 'Create a compelling NARRATIVE poster that tells a story. Use storytelling language, flowing sentences, and paint a picture with words. Make it feel like a journey or discovery. Use descriptive and emotional language.';
      break;
    case 'quote':
      stylePrompt = 'Create an INSPIRATIONAL QUOTE poster. Focus on powerful, memorable quotes that inspire action. Use quotation marks, impactful statements, and motivational language. Make it shareable and Instagram-worthy with quote-style formatting.';
      break;
    case 'pointers':
      stylePrompt = 'Create a structured BULLET-POINT poster with clear, actionable information. Use numbered or bulleted lists, step-by-step instructions, and organized information. Make it practical and easy to scan quickly.';
      break;
  }

  // Build content type prompt
  let contentTypePrompt = '';
  switch (contentType) {
    case 'trending':
      contentTypePrompt = 'Make it trendy, viral, and buzz-worthy with current hashtags and modern language. Focus on what\'s hot and happening NOW. Use emojis and trendy phrases.';
      break;
    case 'awareness':
      contentTypePrompt = 'Focus on education, raising awareness, and inspiring social change. Use empowering language and call-to-action phrases. Make it thought-provoking and meaningful.';
      break;
    case 'informative':
      contentTypePrompt = 'Provide detailed, practical information with facts, statistics, and actionable insights. Use professional language and focus on teaching valuable knowledge.';
      break;
  }

  // Add variation-specific instruction
  const variationPrompt = totalPosters > 1 
    ? `This is poster ${variation} of ${totalPosters}. Create UNIQUE content that approaches the topic from a different angle, perspective, or focus area while staying relevant to the main topic. Ensure this content is distinctly different from other variations.`
    : '';

  const prompt = `
Create poster content based on the following context:
${context}

Style Requirements: ${stylePrompt}
Content Type: ${contentTypePrompt}
${variationPrompt}

Generate content for ${minPages}-${maxPages} pages. Choose the optimal number of pages based on the content.

For each poster, provide:
- A compelling headline (max 60 characters)
- A supporting subtitle (max 120 characters)
- 3-5 bullet points or key messages (each max 80 characters)

Return the response in JSON format with this structure:
{
  "headline": "Main headline",
  "subtitle": "Supporting subtitle",
  "bulletPoints": ["Point 1", "Point 2", "Point 3"],
  "pages": 1
}

Make sure the content is engaging, professional, and suitable for social media sharing.
${totalPosters > 1 ? 'IMPORTANT: Make this content unique and different from other variations on the same topic.' : ''}
`;

  try {
    console.log('📡 Making OpenAI API call...');
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert content creator and social media strategist. Create engaging, professional poster content that captures attention and drives engagement. When creating multiple variations, ensure each one is unique and approaches the topic from a different angle.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8, // Increased temperature for more variation
      max_tokens: 1000
    });

    console.log('✅ OpenAI response received');
    const content = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate and sanitize the response
    const aiContent: AIContent = {
      headline: content.headline || 'Generated Poster',
      subtitle: content.subtitle || 'AI-powered content creation',
      bulletPoints: Array.isArray(content.bulletPoints) ? content.bulletPoints.slice(0, 5) : ['Key insight 1', 'Key insight 2', 'Key insight 3'],
      pages: Math.max(minPages, Math.min(maxPages, content.pages || 1))
    };

    console.log(`🎨 Generated AI content (Variation ${variation}):`, aiContent);
    return aiContent;
  } catch (error) {
    console.error('❌ OpenAI API error:', error);
    console.log('🔄 Falling back to mock content');
    return generateMockContent(params);
  }
}

export async function generateBackgroundImage(prompt: string): Promise<string> {
  if (!isOpenAIConfigured || !openai) {
    throw new Error('OpenAI is not configured');
  }
  
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Create a professional background image for a social media poster: ${prompt}. Make it modern, clean, and suitable for overlay text. Avoid text in the image.`,
      n: 1,
      size: '1024x1024',
      quality: 'standard'
    });

    return response.data?.[0]?.url || '';
  } catch (error) {
    console.error('DALL-E API error:', error);
    throw new Error('Failed to generate background image');
  }
}
