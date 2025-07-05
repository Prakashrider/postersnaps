import { Handler } from '@netlify/functions';
import { neonStorage } from '../../client/src/lib/storage.neon';
// Removed old storage import; fully migrated to neonStorage
import { createPosterConfigSchema } from '../../shared/schema';
import { extractMetadata } from '../../server/services/metadata';
import { generateAIContent } from '../../server/services/openai';
import { renderPoster } from '../../server/services/renderer';
import { verifyFirebaseToken } from '../../server/services/firebase';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    console.log('📝 Received poster generation request:', JSON.stringify(body, null, 2));
    
    const result = createPosterConfigSchema.safeParse(body);
    if (!result.success) {
      console.error('❌ Validation failed:', result.error.errors);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request data', details: result.error.errors }),
      };
    }
    
    const config = result.data;
    console.log('✅ Validated config:', JSON.stringify(config, null, 2));
    
    // Check session limit for free users
    if (!config.userId) {
      const sessionCount = await neonStorage.getSessionPosterCount(config.sessionId);
      if (sessionCount >= 1) { // Production limit: 1 poster per free session
        return {
          statusCode: 429,
          body: JSON.stringify({ error: 'Free limit reached. Please sign in to continue.' }),
        };
      }
    } else {
      // Check if user has unlimited access
      const authHeader = event.headers.authorization || event.headers.Authorization;
      const user = await verifyFirebaseToken(authHeader?.split(' ')[1] || '');
      const adminEmail = process.env.ADMIN_EMAIL || 'maritimeriderprakash@gmail.com';
      const isUnlimitedUser = user?.email === adminEmail;
      
      if (!isUnlimitedUser) {
        // Credits system for authenticated users
        const usage = await neonStorage.getUserUsage(config.userId);
        const userCredits = usage?.credits || 0;
        const userPlan = usage?.plan || 'free';
        
        // Credits required per poster generation (can be configured later)
        const creditsRequired = 1;
        const estimatedPosters = Math.max(config.minPages, 1);
        const totalCreditsNeeded = creditsRequired * estimatedPosters;
        
        if (userPlan === 'free' && userCredits < totalCreditsNeeded) {
          return {
            statusCode: 429,
            body: JSON.stringify({ 
              error: 'Insufficient credits. Purchase credits or upgrade to Premium.',
              creditsRequired: totalCreditsNeeded,
              creditsAvailable: userCredits,
              suggestedAction: 'upgrade'
            }),
          };
        }
        
        // For premium users, give generous daily limits instead of credits
        if (userPlan !== 'premium' && userPlan !== 'enterprise') {
          const dailyLimit = 50;
          if ((usage?.postersCreated || 0) >= dailyLimit) {
            return {
              statusCode: 429,
              body: JSON.stringify({ 
                error: 'Daily limit reached. Upgrade to Premium for unlimited access.',
                creditsRemaining: userCredits 
              }),
            };
          }
        }
      }
    }

    // Create poster config
    const posterConfig = await neonStorage.createPosterConfig({
      ...config,
      status: 'processing'
    });

    // Process in background
    processPostersInBackground(posterConfig.id);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        posterId: posterConfig.id,
        message: 'Poster generation started'
      }),
    };
  } catch (error) {
    console.error('Generate poster error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NETLIFY: process.env.NETLIFY,
        hasOpenAI: !!process.env.OPENAI_API_KEY
      }
    });
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to start poster generation',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

// Helper function to check unlimited access
async function checkUnlimitedAccess(userId: string): Promise<boolean> {
  try {
    // Check if this userId corresponds to the admin email
    const adminEmail = process.env.ADMIN_EMAIL || 'maritimeriderprakash@gmail.com';
    const adminEmails = [adminEmail];
    return adminEmails.includes(userId) || adminEmails.some(email => userId.includes(email));
  } catch (error) {
    console.error('Error checking unlimited access:', error);
    return false;
  }
}

// Background processing function
async function processPostersInBackground(posterId: string) {
  try {
    const posterConfig = await neonStorage.getPosterConfig(posterId);
    if (!posterConfig) return;

    console.log('🔄 Processing poster with config:', JSON.stringify({
      style: posterConfig.style,
      contentType: posterConfig.contentType,
      outputFormat: posterConfig.outputFormat,
      minPages: posterConfig.minPages,
      maxPages: posterConfig.maxPages
    }, null, 2));

    // Extract metadata if URL mode
    let metadata = null;
    if (posterConfig.inputMode === 'url') {
      metadata = await extractMetadata(posterConfig.inputValue);
    }

    // Generate unique AI content for each poster
    // Choose a random number of posters between min and max pages
    const minPosters = Math.max(posterConfig.minPages, 1);
    const maxPosters = Math.max(posterConfig.maxPages, minPosters);
    const numPosters = minPosters === maxPosters ? minPosters : 
      Math.floor(Math.random() * (maxPosters - minPosters + 1)) + minPosters;
    
    console.log(`🎯 Generating ${numPosters} posters (range: ${minPosters}-${maxPosters}) with config:`, {
      style: posterConfig.style,
      contentType: posterConfig.contentType,
      outputFormat: posterConfig.outputFormat,
      minPages: posterConfig.minPages,
      maxPages: posterConfig.maxPages
    });
    
    const posterUrls: string[] = [];
    
    for (let i = 0; i < numPosters; i++) {
      console.log(`🔄 Generating poster ${i + 1}/${numPosters}`);
      
      // Generate unique content for each poster
      const aiContent = await generateAIContent({
        input: posterConfig.inputValue,
        inputMode: posterConfig.inputMode,
        style: posterConfig.style,
        contentType: posterConfig.contentType,
        metadata,
        minPages: 1, // Each poster is 1 page
        maxPages: 1,
        variation: i + 1, // Pass variation number for unique content
        totalPosters: numPosters
      });

      console.log(`✨ Generated content for poster ${i + 1}:`, {
        headline: aiContent.headline,
        subtitle: aiContent.subtitle.substring(0, 50) + '...',
        bulletCount: aiContent.bulletPoints.length
      });

      // Render single poster
      const singlePosterUrls = await renderPoster({
        content: aiContent,
        style: posterConfig.style,
        format: posterConfig.outputFormat,
        pages: 1 // Always 1 page per poster
      });
      
      console.log(`🖼️ Rendered poster ${i + 1}, URLs count:`, singlePosterUrls.length);
      posterUrls.push(...singlePosterUrls);
    }

    // Update poster config
    await neonStorage.updatePosterConfig(posterId, {
      status: 'completed',
      posterUrls
    });

    // Update usage counters and deduct credits
    if (posterConfig.userId) {
      const usage = await neonStorage.getUserUsage(posterConfig.userId);
      
      // Check if user has unlimited access (admin email)
      // For Firebase Auth, the userId is usually the email or we can check via token
      const adminEmail = process.env.ADMIN_EMAIL || 'maritimeriderprakash@gmail.com';
      const isUnlimitedUser = await checkUnlimitedAccess(posterConfig.userId) || 
                             posterConfig.userId === adminEmail;
      
      if (!isUnlimitedUser) {
        // Deduct credits (1 credit per poster generated)
        const creditsToDeduct = posterUrls.length;
        await neonStorage.deductCredits(posterConfig.userId, creditsToDeduct);
        console.log(`💳 Deducted ${creditsToDeduct} credits for user ${posterConfig.userId}`);
      } else {
        console.log(`👑 Unlimited access for admin user ${posterConfig.userId}`);
      }
      
      await neonStorage.updateUserUsage(posterConfig.userId, {
        postersCreated: (usage?.postersCreated || 0) + 1,
        lastPosterCreated: new Date()
      });
    } else {
      await neonStorage.incrementSessionPosterCount(posterConfig.sessionId);
    }

  } catch (error) {
    console.error('Background processing error:', error);
    await neonStorage.updatePosterConfig(posterId, {
      status: 'failed',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
