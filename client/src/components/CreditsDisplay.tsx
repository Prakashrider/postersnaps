import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { Coins, Crown, Zap } from 'lucide-react';

interface CreditsDisplayProps {
  user: User | null;
}

export default function CreditsDisplay({ user }: CreditsDisplayProps) {
  const { data: usage } = useQuery({
    queryKey: ['user-usage', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return null;
      const response = await apiRequest('GET', `/api/user-usage/${user.uid}`);
      return response.json();
    },
    enabled: !!user?.uid,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  if (!user) return null;

  const credits = usage?.credits || 0;
  const plan = usage?.plan || 'free';
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'maritimeriderprakash@gmail.com';
  const isUnlimitedUser = user.email === adminEmail;

  if (isUnlimitedUser) {
    return (
      <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="h-5 w-5" />
            <span className="font-semibold">Unlimited Access</span>
          </div>
          <div className="text-sm opacity-90">Admin</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Coins className="h-5 w-5" />
          <span className="font-semibold">{credits} Credits</span>
        </div>
        <div className="flex items-center space-x-2">
          {plan === 'premium' && <Crown className="h-4 w-4" />}
          <span className="text-sm capitalize">{plan}</span>
        </div>
      </CardContent>
    </Card>
  );
}
