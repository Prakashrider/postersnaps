import { useState } from 'react';
import { User } from 'firebase/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { Coins, Crown, Zap, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreditsPurchaseModalProps {
  user: User | null;
  trigger: React.ReactNode;
}

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  description: string;
  popular: boolean;
}

export default function CreditsPurchaseModal({ user, trigger }: CreditsPurchaseModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: packages } = useQuery({
    queryKey: ['credit-packages'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/credit-packages');
      return response.json();
    }
  });

  const purchaseMutation = useMutation({
    mutationFn: async (packageId: string) => {
      const response = await apiRequest('POST', '/api/purchase-credits', {
        userId: user?.uid,
        packageId,
        paymentToken: 'demo-token' // TODO: Replace with real payment token
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Credits Purchased!",
        description: data.message,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['user-usage'] });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase credits. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handlePurchase = (packageId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase credits.",
        variant: "destructive",
      });
      return;
    }
    purchaseMutation.mutate(packageId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Coins className="h-5 w-5" />
            <span>Purchase Credits</span>
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {packages?.map((pkg: CreditPackage) => (
            <Card key={pkg.id} className={`relative ${pkg.popular ? 'border-blue-500 border-2' : ''}`}>
              {pkg.popular && (
                <Badge className="absolute -top-2 left-4 bg-blue-500">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>{pkg.name}</span>
                  <span className="text-2xl font-bold">${pkg.price}</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{pkg.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Coins className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold">{pkg.credits} Credits</span>
                  </div>
                  <Button
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={purchaseMutation.isPending}
                    className={pkg.popular ? 'bg-blue-500 hover:bg-blue-600' : ''}
                  >
                    {purchaseMutation.isPending ? 'Processing...' : 'Purchase'}
                  </Button>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  <Check className="h-3 w-3 inline mr-1" />
                  1 credit = 1 poster generated
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="border-t pt-4">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>💳 Secure payment processing</p>
            <p>⚡ Credits are added instantly</p>
            <p>🔄 Credits never expire</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
