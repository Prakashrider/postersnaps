import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const packages = [
    {
      id: 'starter',
      name: 'Starter Pack',
      credits: 10,
      price: 5,
      description: 'Perfect for trying out PosterSnaps',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro Pack',
      credits: 50,
      price: 20,
      description: 'Great for regular users',
      popular: true
    },
    {
      id: 'unlimited',
      name: 'Unlimited Pack',
      credits: 999,
      price: 50,
      description: 'For power users and businesses',
      popular: false
    }
  ];
  
  res.json(packages);
}
