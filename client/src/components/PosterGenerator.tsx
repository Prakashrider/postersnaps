import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import ConfigurationModals from './ConfigurationModals';
import PreviewModal from './PreviewModal';
import AuthModal from './AuthModal';
import CreditsDisplay from './CreditsDisplay';
import CreditsPurchaseModal from './CreditsPurchaseModal';
import UserDashboard from './UserDashboard';
import Header from './Header';
import Footer from './Footer';
import { WandSparkles, Search, Link, Flame, Palette, Download, Plus } from 'lucide-react';

interface PosterGeneratorProps {
  user: User | null;
}

export default function PosterGenerator({ user }: PosterGeneratorProps) {
  const [inputMode, setInputMode] = useState<'keyword' | 'url'>('keyword');
  const [inputValue, setInputValue] = useState('');
  const [currentStep, setCurrentStep] = useState<'input' | 'config' | 'preview' | 'auth'>('input');
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 15));
  const [posterConfig, setPosterConfig] = useState({
    style: 'narrative' as const,
    contentType: 'trending' as const,
    outputFormat: 'square' as const,
    minPages: 2,
    maxPages: 4
  });
  const [currentPosterId, setCurrentPosterId] = useState<string | null>(null);
  const { toast } = useToast();

  const generatePosterMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/.netlify/functions/generate-poster', data),
    onSuccess: async (response) => {
      const data = await response.json();
      setCurrentPosterId(data.posterId);
      setCurrentStep('preview');
    },
    onError: (error: any) => {
      if (error.message.includes('Free limit reached')) {
        setCurrentStep('auth');
      } else if (error.message.includes('Insufficient credits')) {
        toast({
          title: "Insufficient Credits",
          description: "You need more credits to generate posters. Purchase credits to continue.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Generation failed",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });

  const posterQuery = useQuery({
    queryKey: [`/.netlify/functions/poster?id=${currentPosterId}`],
    enabled: !!currentPosterId,
    queryFn: async () => {
      const response = await apiRequest('GET', `/.netlify/functions/poster?id=${currentPosterId}`);
      return await response.json();
    },
    refetchInterval: (query) => {
      // Stop polling when poster is completed or failed
      if (query.state.data?.status === 'completed' || query.state.data?.status === 'failed') {
        return false;
      }
      return 2000;
    },
    refetchIntervalInBackground: false,
  });
  
  const { data: posterData, isLoading: posterLoading } = posterQuery;

  const handleStartGeneration = () => {
    if (!inputValue.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a keyword or URL to generate a poster.",
        variant: "destructive",
      });
      return;
    }

    if (inputMode === 'url') {
      try {
        new URL(inputValue);
      } catch {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid URL.",
          variant: "destructive",
        });
        return;
      }
    }

    setCurrentStep('config');
  };

  const handleConfigComplete = () => {
    generatePosterMutation.mutate({
      sessionId,
      userId: user?.uid,
      inputMode,
      inputValue,
      ...posterConfig
    });
  };

  const handleExampleClick = (example: string) => {
    setInputValue(example);
    setInputMode('keyword');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header 
        user={user} 
        onAuthModalOpen={() => setCurrentStep('auth')} 
      />

      {/* User Dashboard - only show for signed in users */}
      {user && <UserDashboard user={user} />}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-black min-h-[75vh] flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-purple-900/20"></div>
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M40 40L20 20v40h40V20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
          {/* Floating elements */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
          <div className="absolute top-32 right-32 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 left-32 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium mb-4 border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300">
              <span className="animate-pulse mr-2">✨</span>
              <span>AI-Powered Poster Generator</span>
              <span className="ml-2 px-1.5 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-xs rounded-full">Beta</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight max-w-3xl mb-3">
              Create Stunning{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 animate-pulse">
                Posters Instantly
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-sm sm:text-base text-white/80 max-w-xl mb-6 font-light leading-relaxed">
              Transform any link or idea into professional visuals in seconds. No design skills needed.
            </p>
            
            {/* Enhanced Input Section - More Organic Design */}
            <div className="max-w-xl w-full mx-auto" id="poster-generator">
              <div className="relative group">
                {/* Organic background with subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/95 to-indigo-50/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50"></div>
                
                {/* Floating glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-pink-400/20 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative p-6 space-y-4">
                  {/* Mode Toggle - More Organic */}
                  <div className="flex items-center justify-center">
                    <div className="relative bg-white/80 backdrop-blur-sm rounded-xl p-1 flex shadow-inner border border-gray-200/50">
                      <Button
                        variant={inputMode === 'keyword' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setInputMode('keyword')}
                        className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-500 ${
                          inputMode === 'keyword' 
                            ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md transform scale-105' 
                            : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50'
                        }`}
                      >
                        <Search className="h-3 w-3 mr-1.5" />
                        Keyword
                      </Button>
                      <Button
                        variant={inputMode === 'url' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setInputMode('url')}
                        className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-500 ${
                          inputMode === 'url' 
                            ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md transform scale-105' 
                            : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50'
                        }`}
                      >
                        <Link className="h-3 w-3 mr-1.5" />
                        URL
                      </Button>
                    </div>
                  </div>

                  {/* Input Form - More Organic */}
                  <div className="space-y-3">
                    <div className="relative group/input">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-sm opacity-0 group-hover/input:opacity-100 transition-opacity duration-300"></div>
                      <Input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={
                          inputMode === 'keyword'
                            ? "Enter a keyword (e.g., 'sustainable living', 'fitness tips')"
                            : "Paste a URL (YouTube, blog, website...)"
                        }
                        className="relative text-sm py-3 px-4 pr-12 rounded-xl border-2 border-gray-200/50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100/50 transition-all duration-500 bg-white/70 backdrop-blur-sm shadow-inner hover:shadow-lg hover:bg-white/80 placeholder:text-gray-400/70"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within/input:text-indigo-500 transition-all duration-300">
                        {inputMode === 'keyword' ? (
                          <Search className="h-4 w-4" />
                        ) : (
                          <Link className="h-4 w-4" />
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={handleStartGeneration}
                      disabled={generatePosterMutation.isPending}
                      className="w-full py-3 text-sm font-semibold bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:via-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-500 shadow-lg hover:shadow-xl rounded-xl border-0 relative overflow-hidden group/button"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/button:translate-x-[100%] transition-transform duration-1000"></div>
                      <WandSparkles className="h-4 w-4 mr-2 relative z-10" />
                      <span className="relative z-10">
                        {generatePosterMutation.isPending ? 'Generating...' : 'Generate Poster'}
                      </span>
                    </Button>
                  </div>

                  {/* Example Section - More Organic */}
                  <div className="pt-4 border-t border-gray-200/50">
                    <p className="text-xs text-gray-500 mb-3 text-center font-medium">Try these examples:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['Climate Change', 'Digital Marketing', 'Healthy Recipes', 'AI Technology', 'Fitness Tips'].map((example) => (
                        <Button
                          key={example}
                          variant="outline"
                          size="sm"
                          onClick={() => handleExampleClick(example)}
                          className="rounded-full text-xs px-3 py-1.5 border-gray-300/50 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-300 backdrop-blur-sm bg-white/50 hover:shadow-md hover:transform hover:scale-105"
                        >
                          {example}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced overlay effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/10 to-indigo-900/30 pointer-events-none"></div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center text-white/60 hover:text-white/80 transition-colors duration-300">
            <span className="text-xs font-medium mb-1">Discover More</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Features Section */}
        <section className="py-16 bg-white" id="features">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center mb-2">
                <span className="relative inline-flex">
                  <span className="text-gray-900 text-3xl md:text-4xl font-bold">Why Choose PosterSnaps?</span>
                  <span className="absolute -bottom-2 left-0 right-0 h-1.5 bg-indigo-200 rounded-full"></span>
                </span>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto mt-4">Experience the future of poster design with our innovative features designed for modern content creators.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Feature 1 */}
              <article className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-md hover:border-indigo-100 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-indigo-600"></div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 transition-transform duration-300 group-hover:scale-110">
                    <Link className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12" />
                  </div>
                  <div className="flex flex-col items-start">
                    <h3 className="text-gray-900 font-semibold text-lg">Link-to-Poster Magic</h3>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Simply paste any link and watch as we extract content and create stunning visuals automatically.
                  </p>
                </div>
                
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => document.getElementById('poster-generator')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-300 flex items-center group/link p-0"
                  >
                    Try it now
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover/link:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </div>
              </article>
              
              {/* Feature 2 */}
              <article className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-md hover:border-indigo-100 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 transition-transform duration-300 group-hover:scale-110">
                    <WandSparkles className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12" />
                  </div>
                  <div className="flex flex-col items-start">
                    <h3 className="text-gray-900 font-semibold text-lg">AI-Powered Design</h3>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Advanced AI analyzes your content and creates professionally designed posters with perfect layouts.
                  </p>
                </div>
                
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => document.getElementById('poster-generator')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors duration-300 flex items-center group/link p-0"
                  >
                    Explore AI
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover/link:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </div>
              </article>
              
              {/* Feature 3 */}
              <article className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col transition-all duration-300 hover:shadow-md hover:border-indigo-100 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 transition-transform duration-300 group-hover:scale-110">
                    <Download className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12" />
                  </div>
                  <div className="flex flex-col items-start">
                    <h3 className="text-gray-900 font-semibold text-lg">Instant Download</h3>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Get high-quality PNG and JPG files ready for social media, printing, or any platform instantly.
                  </p>
                </div>
                
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => document.getElementById('poster-generator')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-300 flex items-center group/link p-0"
                  >
                    Start creating
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover/link:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-12">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
              How It Works
            </h3>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="text-white h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">1. Enter Your Idea</h4>
                <p className="text-gray-600">Start with a keyword or paste a URL from YouTube, blogs, or any website.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Palette className="text-white h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">2. Customize Style</h4>
                <p className="text-gray-600">Choose from narrative, quote, or pointer styles with different formats and themes.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Download className="text-white h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">3. Download & Share</h4>
                <p className="text-gray-600">Get your professional poster in PNG or JPG format, ready to share anywhere.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sample Posters Section */}
        <section className="mb-12">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Sample Posters
            </h3>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Narrative Style",
                  description: "Perfect for storytelling and educational content",
                  image: "/images/sample-posters/narrative-style.svg"
                },
                {
                  title: "Quote Style",
                  description: "Highlight powerful quotes and key messages",
                  image: "/images/sample-posters/quote-style.svg"
                },
                {
                  title: "Pointer Style",
                  description: "Organize information with clear bullet points",
                  image: "/images/sample-posters/pointer-style.svg"
                }
              ].map((item, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-[4/5] bg-gray-100 flex items-center justify-center">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-gray-800 mb-2">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ConfigurationModals
        isOpen={currentStep === 'config'}
        onClose={() => setCurrentStep('input')}
        onComplete={handleConfigComplete}
        config={posterConfig}
        setConfig={setPosterConfig}
      />

      <PreviewModal
        isOpen={currentStep === 'preview'}
        onClose={() => setCurrentStep('input')}
        posterData={posterData}
        isLoading={posterLoading}
        onCreateAnother={() => {
          setCurrentStep('input');
          setCurrentPosterId(null);
          setInputValue('');
        }}
      />

      <AuthModal
        isOpen={currentStep === 'auth'}
        onClose={() => setCurrentStep('input')}
        onSuccess={() => setCurrentStep('input')}
      />
    </div>
  );
}
