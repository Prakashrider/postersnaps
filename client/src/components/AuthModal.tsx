import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { signInWithGoogle, signUpWithEmail, signInWithEmail } from '@/lib/firebase';
import { UserPlus, Mail } from 'lucide-react';
import { useState, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: 'free-limit' | 'signup' | 'signin'; // context for modal
}

export default function AuthModal({ isOpen, onClose, onSuccess, mode = 'signup' }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(mode === 'signup' || mode === 'free-limit');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  // Contextual content
  const content = {
    'free-limit': {
      title: 'Experience More with PosterSnaps',
      description: 'Sign up to unlock advanced poster styles, premium backgrounds, exclusive themes, and richer design options. Your next poster can be even better!',
      google: 'Sign up with Google',
      email: 'Sign up with Email',
      toggle: 'Already have an account?',
      toggleAction: 'Sign in',
      showToggle: true,
      showSignUp: true,
    },
    'signup': {
      title: 'Create Your Free Account',
      description: 'Join PosterSnaps to access premium poster designs, save your creations, and explore more creative features.',
      google: 'Sign up with Google',
      email: 'Sign up with Email',
      toggle: 'Already have an account?',
      toggleAction: 'Sign in',
      showToggle: true,
      showSignUp: true,
    },
    'signin': {
      title: 'Welcome Back',
      description: 'Sign in to continue creating and managing your posters. Enjoy all your saved designs and premium features.',
      google: 'Sign in with Google',
      email: 'Sign in with Email',
      toggle: "Don't have an account?",
      toggleAction: 'Sign up',
      showToggle: true,
      showSignUp: false,
    },
  }[mode];

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    try {
      setIsGoogleLoading(true);
      await signInWithGoogle();
      // Optionally: refresh user state here if using context
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Google sign in error:', error);
      let msg = "Please try again or use email authentication.";
      if (error.code === 'auth/popup-closed-by-user') {
        msg = "Sign-in was cancelled. Please try again.";
      } else if (error.code === 'auth/popup-blocked') {
        msg = "Popup was blocked. Please allow popups for this site or try email authentication.";
      } else if (error.code === 'auth/network-request-failed') {
        msg = "Network error. Please check your internet connection.";
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        msg = "An account already exists with this email using a different sign-in method. Try email sign-in.";
      } else if (error.code === 'auth/unauthorized-domain') {
        msg = "This domain is not authorized for Google sign-in. Please contact support or use email authentication.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        msg = "Another sign-in popup was already open. Please close it and try again.";
      } else if (error.code === 'auth/user-disabled') {
        msg = "Your account has been disabled. Please contact support.";
      } else if (error.code === 'auth/operation-not-allowed') {
        msg = "Google sign-in is not enabled. Please contact support or use email authentication.";
      } else if (error.message?.includes('Cross-Origin-Opener-Policy')) {
        msg = "Browser security settings are blocking the popup. Please try email authentication instead.";
      } else if (error.message) {
        msg = error.message;
      }
      setErrorMessage(msg);
      toast({
        title: "Google Sign-in failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    setErrorMessage(null);
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      toast({
        title: "Missing information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsEmailLoading(true);
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
      // Optionally: refresh user state here if using context
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Email auth error:', error);
      let msg = "An error occurred. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        msg = "This email is already registered. Try signing in instead.";
      } else if (error.code === 'auth/weak-password') {
        msg = "Password is too weak. Please use a stronger password.";
      } else if (error.code === 'auth/invalid-email') {
        msg = "Please enter a valid email address.";
      } else if (error.code === 'auth/user-not-found') {
        msg = "No account found with this email. Try signing up instead.";
      } else if (error.code === 'auth/wrong-password') {
        msg = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/user-disabled') {
        msg = "Your account has been disabled. Please contact support.";
      } else if (error.code === 'auth/too-many-requests') {
        msg = "Too many failed attempts. Please wait a moment and try again.";
      } else if (error.code === 'auth/operation-not-allowed') {
        msg = "Email/password sign-in is not enabled. Please contact support.";
      } else if (error.message) {
        msg = error.message;
      }
      setErrorMessage(msg);
      toast({
        title: isSignUp ? "Sign up failed" : "Sign in failed",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setIsEmailLoading(false);
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
            {content.title}
          </h3>
          <p className="text-gray-600">
            {content.description}
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isEmailLoading}
            className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isGoogleLoading ? (
              <span className="flex items-center"><svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>{content.google.replace('Sign', isSignUp ? 'Sign up' : 'Sign in')}...</span>
            ) : content.google.replace('Sign', isSignUp ? 'Sign up' : 'Sign in')}
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  disabled={isGoogleLoading || isEmailLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  disabled={isGoogleLoading || isEmailLoading}
                />
              </div>

              <Button
                onClick={handleEmailAuth}
                disabled={isEmailLoading || isGoogleLoading}
                className="w-full bg-gray-800 hover:bg-gray-900 flex items-center justify-center"
              >
                <Mail className="h-4 w-4 mr-2" />
                {isEmailLoading ? (
                  <span className="flex items-center"><svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>{content.email.replace('Sign', isSignUp ? 'Sign up' : 'Sign in')}...</span>
                ) : (isSignUp ? content.email : content.email.replace('Sign up', 'Sign in'))}
              </Button>
            </CardContent>
          </Card>

          {content.showToggle && (
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm"
              >
                {isSignUp ? content.toggle : (mode === 'signin' ? "Don't have an account?" : content.toggle)}{' '}
                <span className="text-primary font-semibold ml-1">
                  {isSignUp ? content.toggleAction : (mode === 'signin' ? 'Sign up' : content.toggleAction)}
                </span>
              </Button>
            </div>
          )}

          {errorMessage && (
            <div className="text-red-600 text-sm text-center mt-2">{errorMessage}</div>
          )}
        </div>
      </div>
    </Modal>
  );
}
