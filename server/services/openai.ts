import OpenAI from 'openai';
import { PosterStyle, ContentType, InputMode, Metadata, AIContent } from '@shared/schema';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY
});

interface GenerateContentParams {
  input: string;
  inputMode: InputMode;
  style: PosterStyle;
  contentType: ContentType;
  metadata?: Metadata | null;
  minPages: number;
  maxPages: number;
}

export async function generateAIContent(params: GenerateContentParams): Promise<AIContent> {
  const { input, inputMode, style, contentType, metadata, minPages, maxPages } = params;
  
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
      stylePrompt = 'Create engaging narrative content that tells a story and flows naturally.';
      break;
    case 'quote':
      stylePrompt = 'Focus on powerful, memorable quotes and key messages that inspire action.';
      break;
    case 'pointers':
      stylePrompt = 'Organize information into clear, actionable bullet points and structured lists.';
      break;
  }

  // Build content type prompt
  let contentTypePrompt = '';
  switch (contentType) {
    case 'trending':
      contentTypePrompt = 'Make it trendy, current, and appealing to modern audiences.';
      break;
    case 'awareness':
      contentTypePrompt = 'Focus on education, awareness, and informing the audience.';
      break;
    case 'informative':
      contentTypePrompt = 'Provide detailed, practical information and actionable insights.';
      break;
  }

  const prompt = `
Create poster content based on the following context:
${context}

Style Requirements: ${stylePrompt}
Content Type: ${contentTypePrompt}

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
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: 'system',
          content: 'You are an expert content creator and social media strategist. Create engaging, professional poster content that captures attention and drives engagement.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate and sanitize the response
    const aiContent: AIContent = {
      headline: content.headline || 'Generated Poster',
      subtitle: content.subtitle || 'AI-powered content creation',
      bulletPoints: Array.isArray(content.bulletPoints) ? content.bulletPoints.slice(0, 5) : ['Key insight 1', 'Key insight 2', 'Key insight 3'],
      pages: Math.max(minPages, Math.min(maxPages, content.pages || 1))
    };

    return aiContent;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate AI content');
  }
}

export async function generateBackgroundImage(prompt: string): Promise<string> {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Create a professional background image for a social media poster: ${prompt}. Make it modern, clean, and suitable for overlay text. Avoid text in the image.`,
      n: 1,
      size: '1024x1024',
      quality: 'standard'
    });

    return response.data[0].url || '';
  } catch (error) {
    console.error('DALL-E API error:', error);
    throw new Error('Failed to generate background image');
  }
}
