import puppeteer from 'puppeteer';
import { PosterStyle, OutputFormat, AIContent } from '@shared/schema';
import { readFileSync } from 'fs';
import { join } from 'path';



interface RenderParams {
  content: AIContent;
  style: PosterStyle;
  format: OutputFormat;
  pages: number;
}

export async function renderPoster(params: RenderParams): Promise<string[]> {
  const { content, style, format, pages } = params;
  
  console.log('🖼️ Rendering poster with params:', JSON.stringify({
    style,
    format,
    pages,
    headline: content.headline.substring(0, 30) + '...'
  }, null, 2));

  try {
    // Try Puppeteer first, fallback to SVG generation
    if (process.env.NODE_ENV === 'production' || process.env.FORCE_FALLBACK_RENDERER) {
      return await generateSVGPosters(content, style, format, pages);
    }
    
    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const posterUrls: string[] = [];
    
    // Generate each page
    for (let i = 0; i < pages; i++) {
      const page = await browser.newPage();
      
      // Set viewport based on format
      const dimensions = getFormatDimensions(format);
      await page.setViewport(dimensions);
      
      // Generate HTML content
      const html = await generatePosterHTML(content, style, format, i);
      
      // Set content and wait for fonts to load
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      // Take screenshot
      const screenshot = await page.screenshot({
        type: 'png',
        fullPage: true,
        omitBackground: false
      });
      
      // Convert to base64 URL (in production, upload to Firebase Storage)
      const base64 = Buffer.from(screenshot).toString('base64');
      const dataUrl = `data:image/png;base64,${base64}`;
      posterUrls.push(dataUrl);
      
      await page.close();
    }
    
    await browser.close();
    return posterUrls;
  } catch (error) {
    console.error('Poster rendering error:', error);
    console.log('Falling back to SVG rendering...');
    // Fallback to SVG generation
    return await generateSVGPosters(content, style, format, pages);
  }
}

function getFormatDimensions(format: OutputFormat) {
  switch (format) {
    case 'square':
      return { width: 1080, height: 1080 };
    case 'portrait':
      return { width: 1080, height: 1350 };
    case 'story':
      return { width: 1080, height: 1920 };
    default:
      return { width: 1080, height: 1080 };
  }
}

async function generatePosterHTML(content: AIContent, style: PosterStyle, format: OutputFormat, pageIndex: number): Promise<string> {
  const templatePath = join(process.cwd(), 'client', 'src', 'templates', `${style}.html`);
  
  try {
    const template = readFileSync(templatePath, 'utf-8');
    
    // Replace placeholders with actual content
    let html = template
      .replace(/\{\{headline\}\}/g, content.headline)
      .replace(/\{\{subtitle\}\}/g, content.subtitle)
      .replace(/\{\{format\}\}/g, format);
    
    // Handle bullet points
    if (content.bulletPoints && content.bulletPoints.length > 0) {
      const bulletHTML = content.bulletPoints.map(point => 
        `<li class="bullet-point">${point}</li>`
      ).join('');
      html = html.replace(/\{\{bulletPoints\}\}/g, bulletHTML);
    }
    
    return html;
  } catch (error) {
    console.error('Template loading error:', error);
    // Fallback to basic template
    return generateFallbackHTML(content, style, format);
  }
}

async function generateSVGPosters(content: AIContent, style: PosterStyle, format: OutputFormat, pages: number): Promise<string[]> {
  const posterUrls: string[] = [];
  const dimensions = getFormatDimensions(format);
  
  for (let i = 0; i < pages; i++) {
    const svg = generatePosterSVG(content, style, format, dimensions);
    const base64 = Buffer.from(svg).toString('base64');
    const dataUrl = `data:image/svg+xml;base64,${base64}`;
    posterUrls.push(dataUrl);
  }
  
  return posterUrls;
}

function generatePosterSVG(content: AIContent, style: PosterStyle, format: OutputFormat, dimensions: { width: number; height: number }): string {
  const { width, height } = dimensions;
  
  // Choose colors based on style
  const styleColors = {
    narrative: { bg: '#667eea', accent: '#764ba2', text: '#ffffff' },
    quote: { bg: '#ff6b6b', accent: '#feca57', text: '#ffffff' },
    pointers: { bg: '#4ecdc4', accent: '#45b7aa', text: '#ffffff' }
  };
  
  const colors = styleColors[style];
  
  const bulletPoints = content.bulletPoints.map((point, index) => 
    `<text x="80" y="${380 + (index * 60)}" font-family="Inter, sans-serif" font-size="24" fill="${colors.text}" font-weight="400">• ${point}</text>`
  ).join('\n      ');

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors.bg};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:1" />
      </linearGradient>
    </defs>
    
    <rect width="100%" height="100%" fill="url(#gradient)"/>
    
    <text x="60" y="120" font-family="Inter, sans-serif" font-size="48" fill="${colors.text}" font-weight="700">${content.headline}</text>
    <text x="60" y="200" font-family="Inter, sans-serif" font-size="28" fill="${colors.text}" font-weight="400" opacity="0.9">${content.subtitle}</text>
    
    <rect x="40" y="280" width="${width-80}" height="${content.bulletPoints.length * 60 + 40}" fill="rgba(255,255,255,0.1)" rx="20"/>
    
    ${bulletPoints}
    
    <text x="60" y="${height-40}" font-family="Inter, sans-serif" font-size="16" fill="${colors.text}" opacity="0.7">Generated with PosterSnaps AI</text>
  </svg>`;
}

function generateFallbackHTML(content: AIContent, style: PosterStyle, format: OutputFormat): string {
  const dimensions = getFormatDimensions(format);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Poster</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            width: ${dimensions.width}px;
            height: ${dimensions.height}px;
            background: linear-gradient(135deg, #6366F1 0%, #EC4899 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 60px;
            color: white;
        }
        
        .poster-container {
            text-align: center;
            max-width: 100%;
        }
        
        .headline {
            font-size: ${format === 'story' ? '3.5rem' : '2.5rem'};
            font-weight: 700;
            margin-bottom: 20px;
            line-height: 1.1;
        }
        
        .subtitle {
            font-size: ${format === 'story' ? '1.5rem' : '1.25rem'};
            font-weight: 400;
            margin-bottom: 40px;
            opacity: 0.9;
            line-height: 1.3;
        }
        
        .bullet-points {
            list-style: none;
            text-align: left;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .bullet-point {
            font-size: ${format === 'story' ? '1.25rem' : '1.125rem'};
            margin-bottom: 16px;
            padding-left: 30px;
            position: relative;
            line-height: 1.4;
        }
        
        .bullet-point::before {
            content: "•";
            position: absolute;
            left: 0;
            font-size: 1.5em;
            color: #10B981;
        }
    </style>
</head>
<body>
    <div class="poster-container">
        <h1 class="headline">${content.headline}</h1>
        <p class="subtitle">${content.subtitle}</p>
        <ul class="bullet-points">
            ${content.bulletPoints.map(point => `<li class="bullet-point">${point}</li>`).join('')}
        </ul>
    </div>
</body>
</html>
  `;
}
