import { useState } from 'react';
import { User } from 'firebase/auth';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';
import { Crown, Plus, Users, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  user: User | null;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState('');
  const [creditsToAdd, setCreditsToAdd] = useState('');
  const { toast } = useToast();

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'maritimeriderprakash@gmail.com';

  const addCreditsMutation = useMutation({
    mutationFn: async (data: { userId: string; credits: number }) => {
      if (!user) throw new Error('User not authenticated');
      const token = await user.getIdToken();
      const response = await apiRequest('POST', '/api/admin/add-credits', {
        adminToken: token,
        userId: data.userId,
        credits: data.credits
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Credits Added",
        description: data.message,
        variant: "default",
      });
      setTargetUserId('');
      setCreditsToAdd('');
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to Add Credits",
        description: "Please check the user ID and try again.",
        variant: "destructive",
      });
    }
  });

  const handleAddCredits = () => {
    if (!targetUserId.trim() || !creditsToAdd.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter both user ID and credits amount.",
        variant: "destructive",
      });
      return;
    }

    const credits = parseInt(creditsToAdd);
    if (isNaN(credits) || credits <= 0) {
      toast({
        title: "Invalid Credits",
        description: "Please enter a valid number of credits.",
        variant: "destructive",
      });
      return;
    }

    addCreditsMutation.mutate({
      userId: targetUserId,
      credits
    });
  };

  // Only show for admin users
  if (!user || user.email !== adminEmail) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
          >
            <Crown className="h-4 w-4 mr-2" />
            Admin
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              <span>Admin Dashboard</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Credits to User
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    placeholder="Enter user ID"
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="credits">Credits to Add</Label>
                  <Input
                    id="credits"
                    type="number"
                    placeholder="Enter credits amount"
                    value={creditsToAdd}
                    onChange={(e) => setCreditsToAdd(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleAddCredits}
                  disabled={addCreditsMutation.isPending}
                  className="w-full"
                >
                  {addCreditsMutation.isPending ? 'Adding...' : 'Add Credits'}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2" />
                  Admin Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Admin Email:</span>
                    <span className="font-mono">{user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Access Level:</span>
                    <span className="text-yellow-600 font-semibold">Unlimited</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Credits:</span>
                    <span className="text-green-600 font-semibold">∞</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
