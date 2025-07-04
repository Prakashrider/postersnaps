import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { signInWithGoogle, signUpWithEmail, signInWithEmail } from '@/lib/firebase';
import { UserPlus, Mail } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Google sign in error:', error);
      
      let errorMessage = "Please try again or use email authentication.";
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in was cancelled. Please try again.";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked. Please allow popups for this site or try email authentication.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.message?.includes('Cross-Origin-Opener-Policy')) {
        errorMessage = "Browser security settings are blocking the popup. Please try email authentication instead.";
      }
      
      toast({
        title: "Google Sign-in failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      if (isSignUp) {
        await signUpWithEmail(email, password);
        toast({
          title: "Account created!",
          description: "Welcome to PosterSnaps!",
          variant: "default",
        });
      } else {
        await signInWithEmail(email, password);
        toast({
          title: "Welcome back!",
          description: "You're successfully signed in.",
          variant: "default",
        });
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Email auth error:', error);
      
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered. Try signing in instead.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email. Try signing up instead.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password. Please try again.";
      }
      
      toast({
        title: isSignUp ? "Sign up failed" : "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-white h-8 w-8" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {isSignUp ? 'Free Limit Reached' : 'Welcome Back'}
          </h3>
          <p className="text-gray-600">
            {isSignUp ? 'Sign up to create unlimited posters' : 'Sign in to continue creating posters'}
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button
                onClick={handleEmailAuth}
                disabled={isLoading}
                className="w-full bg-gray-800 hover:bg-gray-900"
              >
                <Mail className="h-4 w-4 mr-2" />
                {isLoading ? 'Processing...' : (isSignUp ? 'Sign up with Email' : 'Sign in with Email')}
              </Button>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm"
            >
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <span className="text-primary font-semibold ml-1">
                {isSignUp ? 'Sign in' : 'Sign up'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
