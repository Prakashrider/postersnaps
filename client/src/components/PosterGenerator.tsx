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
import { WandSparkles, Search, Link, Flame, Palette, Download } from 'lucide-react';

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
    minPages: 1,
    maxPages: 3
  });
  const [currentPosterId, setCurrentPosterId] = useState<string | null>(null);
  const { toast } = useToast();

  const generatePosterMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/generate-poster', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: (data) => {
      setCurrentPosterId(data.posterId);
      setCurrentStep('preview');
    },
    onError: (error: any) => {
      if (error.message.includes('Free limit reached')) {
        setCurrentStep('auth');
      } else {
        toast({
          title: "Generation failed",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });

  const { data: posterData, isLoading: posterLoading } = useQuery({
    queryKey: ['/api/poster', currentPosterId],
    enabled: !!currentPosterId,
    refetchInterval: (data) => data?.status === 'processing' ? 2000 : false,
  });

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
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <WandSparkles className="text-white h-4 w-4" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PosterSnaps
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Welcome, {user.displayName}</span>
                </div>
              ) : (
                <Button onClick={() => setCurrentStep('auth')}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Landing Section */}
        <section className="text-center mb-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Create Stunning Posters with{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AI Magic
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform your ideas into professional posters in seconds. Just enter a keyword or URL, and let our AI do the rest.
            </p>

            {/* Input Section */}
            <Card className="max-w-2xl mx-auto shadow-xl border-gray-200/50">
              <CardContent className="p-8">
                {/* Mode Toggle */}
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gray-100 rounded-full p-1 flex">
                    <Button
                      variant={inputMode === 'keyword' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setInputMode('keyword')}
                      className="rounded-full"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Keyword Mode
                    </Button>
                    <Button
                      variant={inputMode === 'url' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setInputMode('url')}
                      className="rounded-full"
                    >
                      <Link className="h-4 w-4 mr-2" />
                      URL Mode
                    </Button>
                  </div>
                </div>

                {/* Input Form */}
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={
                        inputMode === 'keyword'
                          ? "Enter a keyword (e.g., 'sustainable living', 'fitness tips')"
                          : "Paste a URL (YouTube, blog, website...)"
                      }
                      className="text-lg py-6 px-6 pr-12"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Search className="h-5 w-5" />
                    </div>
                  </div>

                  <Button
                    onClick={handleStartGeneration}
                    disabled={generatePosterMutation.isPending}
                    className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <WandSparkles className="h-5 w-5 mr-2" />
                    Generate Poster
                  </Button>
                </div>

                {/* Example Section */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-4">Try these examples:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Climate Change', 'Digital Marketing', 'Healthy Recipes'].map((example) => (
                      <Button
                        key={example}
                        variant="outline"
                        size="sm"
                        onClick={() => handleExampleClick(example)}
                        className="rounded-full"
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
              How It Works
            </h3>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="text-white h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">1. Enter Your Idea</h4>
                <p className="text-gray-600">Start with a keyword or paste a URL from YouTube, blogs, or any website.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Palette className="text-white h-8 w-8" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">2. Customize Style</h4>
                <p className="text-gray-600">Choose from narrative, quote, or pointer styles with different formats and themes.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-6">
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
                  image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"
                },
                {
                  title: "Quote Style",
                  description: "Highlight powerful quotes and key messages",
                  image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"
                },
                {
                  title: "Pointer Style",
                  description: "Organize information with clear bullet points",
                  image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"
                }
              ].map((item, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="h-64 bg-gradient-to-br from-primary to-secondary"></div>
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
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                  <WandSparkles className="text-white h-4 w-4" />
                </div>
                <h4 className="text-xl font-bold">PosterSnaps</h4>
              </div>
              <p className="text-gray-400">Create stunning posters with AI in seconds.</p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Features</h5>
              <ul className="space-y-2 text-gray-400">
                <li>AI Text Generation</li>
                <li>Multiple Templates</li>
                <li>URL Extraction</li>
                <li>High-Quality Export</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>API Documentation</li>
                <li>Terms of Service</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Connect</h5>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Flame className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Flame className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Flame className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PosterSnaps. All rights reserved.</p>
          </div>
        </div>
      </footer>

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
