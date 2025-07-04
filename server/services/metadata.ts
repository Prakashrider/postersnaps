import { Metadata } from '@shared/schema';

export async function extractMetadata(url: string): Promise<Metadata> {
  try {
    // Check if it's a YouTube URL
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return await extractYouTubeMetadata(url);
    }
    
    // For other URLs, use a simple fetch approach
    return await extractWebMetadata(url);
  } catch (error) {
    console.error('Metadata extraction error:', error);
    throw new Error('Failed to extract metadata from URL');
  }
}

async function extractYouTubeMetadata(url: string): Promise<Metadata> {
  try {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    const apiKey = process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error('YouTube API key not configured');
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`
    );

    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }

    const data = await response.json();
    const video = data.items?.[0];
    
    if (!video) {
      throw new Error('Video not found');
    }

    return {
      title: video.snippet.title,
      description: video.snippet.description,
      url: url,
      image: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.default?.url,
      author: video.snippet.channelTitle
    };
  } catch (error) {
    console.error('YouTube metadata error:', error);
    throw new Error('Failed to extract YouTube metadata');
  }
}

async function extractWebMetadata(url: string): Promise<Metadata> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch URL');
    }

    const html = await response.text();
    
    // Extract basic metadata using regex (simple approach)
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descriptionMatch = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"\']+)["\'][^>]*>/i);
    const imageMatch = html.match(/<meta[^>]*property=["\']og:image["\'][^>]*content=["\']([^"\']+)["\'][^>]*>/i);

    return {
      title: titleMatch?.[1]?.trim() || 'Untitled',
      description: descriptionMatch?.[1]?.trim() || '',
      url: url,
      image: imageMatch?.[1] || undefined,
      author: undefined
    };
  } catch (error) {
    console.error('Web metadata error:', error);
    throw new Error('Failed to extract web metadata');
  }
}

function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^&\n?#]+)/,
    /(?:https?:\/\/)?youtu\.be\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}
