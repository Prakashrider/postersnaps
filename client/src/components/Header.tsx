import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { signOut } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { User as UserIcon, LogOut, Settings } from 'lucide-react';

interface HeaderProps {
  user: User | null;
  onAuthModalOpen: () => void;
}

export default function Header({ user, onAuthModalOpen }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
        variant: "default",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white/95 backdrop-blur-sm border-b border-solid border-gray-100 px-4 sm:px-6 lg:px-10 py-3 transition-all duration-300 shadow-sm">
      <div className="flex items-center gap-3 text-gray-900">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity" aria-label="PosterSnaps Home">
          <div className="w-5 h-5 sm:w-6 sm:h-6">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PosterSnaps Logo" className="text-indigo-600">
              <path
                d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-tight">PosterSnaps</h2>
        </Link>
      </div>
      
      <nav className="flex items-center justify-end space-x-2 sm:space-x-6" role="navigation" aria-label="Main navigation">
        {/* Mobile Navigation Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="sm:hidden p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 mr-2" 
          aria-label="Toggle mobile menu" 
          aria-expanded={isMobileMenuOpen}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      
        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`${isActive('/') ? 'text-indigo-600 border-indigo-600' : 'text-gray-700 border-transparent hover:border-indigo-300 hover:text-indigo-600'} text-sm font-medium leading-normal transition-colors duration-200 border-b-2`}
            aria-label="Home page"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`${isActive('/about') ? 'text-indigo-600 border-indigo-600' : 'text-gray-700 border-transparent hover:border-indigo-300 hover:text-indigo-600'} text-sm font-medium leading-normal transition-colors duration-200 border-b-2`}
            aria-label="Learn about PosterSnaps"
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`${isActive('/contact') ? 'text-indigo-600 border-indigo-600' : 'text-gray-700 border-transparent hover:border-indigo-300 hover:text-indigo-600'} text-sm font-medium leading-normal transition-colors duration-200 border-b-2`}
            aria-label="Contact us"
          >
            Contact
          </Link>
          <Link 
            to="/faq" 
            className={`${isActive('/faq') ? 'text-indigo-600 border-indigo-600' : 'text-gray-700 border-transparent hover:border-indigo-300 hover:text-indigo-600'} text-sm font-medium leading-normal transition-colors duration-200 border-b-2`}
            aria-label="View frequently asked questions"
          >
            FAQ
          </Link>
          <Link 
            to="/how-it-works" 
            className={`${isActive('/how-it-works') ? 'text-indigo-600 border-indigo-600' : 'text-gray-700 border-transparent hover:border-indigo-300 hover:text-indigo-600'} text-sm font-medium leading-normal transition-colors duration-200 border-b-2`}
            aria-label="Learn how PosterSnaps works"
          >
            How It Works
          </Link>
        </div>
        
        {/* Authentication Buttons */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4" />
                <span className="text-sm">{user.displayName || user.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <UserIcon className="h-4 w-4 mr-2" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onAuthModalOpen}
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Login
            </Button>
            <Button 
              onClick={onAuthModalOpen}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg px-4 py-2 transition-all duration-200 shadow-sm hover:shadow"
            >
              Sign Up
            </Button>
          </div>
        )}
      </nav>
      
      {/* Mobile Menu - Hidden by default */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-md z-50">
          <div className="flex flex-col py-3 px-4">
            <Link 
              to="/" 
              className={`${isActive('/') ? 'text-indigo-600 border-indigo-600' : 'text-gray-700'} font-medium py-2 ${isActive('/') ? 'border-l-4 pl-2' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-gray-900 py-2 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-gray-900 py-2 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              to="/faq" 
              className="text-gray-700 hover:text-gray-900 py-2 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-gray-700 hover:text-gray-900 py-2 font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            {!user && (
              <div className="border-t border-gray-200 pt-3 mt-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    onAuthModalOpen();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start text-gray-700 hover:text-gray-900 font-medium mb-2"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => {
                    onAuthModalOpen();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
