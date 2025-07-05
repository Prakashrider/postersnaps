import { Handler } from '@netlify/functions';
import { storage } from '../../server/storage';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { userId, packageId, paymentToken } = JSON.parse(event.body || '{}');
    
    // TODO: Implement payment processing here
    // For now, just add credits for testing
    const creditPackages = {
      'starter': { credits: 10, price: 5 },
      'pro': { credits: 50, price: 20 },
      'unlimited': { credits: 999, price: 50 }
    };
    
    const selectedPackage = creditPackages[packageId as keyof typeof creditPackages];
    if (!selectedPackage) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid package selected' }),
      };
    }
    
    // Add credits to user account
    const updatedUsage = await storage.addCredits(userId, selectedPackage.credits);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: `${selectedPackage.credits} credits added to your account`,
        newBalance: updatedUsage.credits
      }),
    };
  } catch (error) {
    console.error('Purchase credits error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process credit purchase' }),
    };
  }
};
