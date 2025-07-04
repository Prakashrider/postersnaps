import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auth, handleRedirectResult } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import PosterGenerator from '@/components/PosterGenerator';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Handle Firebase redirect result
    handleRedirectResult().then((result) => {
      if (result?.user) {
        toast({
          title: "Welcome!",
          description: "You've successfully signed in.",
        });
      }
    }).catch((error) => {
      console.error('Auth redirect error:', error);
      toast({
        title: "Sign in failed",
        description: "Please try again.",
        variant: "destructive",
      });
    });

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PosterGenerator user={user} />
    </div>
  );
}
