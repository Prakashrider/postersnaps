import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, packageId, paymentToken } = req.body;
    
    // TODO: Implement payment processing here
    // For now, just add credits for testing
    const creditPackages = {
      'starter': { credits: 10, price: 5 },
      'pro': { credits: 50, price: 20 },
      'unlimited': { credits: 999, price: 50 }
    };
    
    const selectedPackage = creditPackages[packageId as keyof typeof creditPackages];
    if (!selectedPackage) {
      return res.status(400).json({ error: 'Invalid package selected' });
    }
    
    // Add credits to user account
    const updatedUsage = await storage.addCredits(userId, selectedPackage.credits);
    
    res.json({ 
      success: true, 
      message: `${selectedPackage.credits} credits added to your account`,
      newBalance: updatedUsage.credits
    });
  } catch (error) {
    console.error('Purchase credits error:', error);
    res.status(500).json({ error: 'Failed to process credit purchase' });
  }
}