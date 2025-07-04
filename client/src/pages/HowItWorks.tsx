import { User } from 'firebase/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Link, 
  Settings, 
  Download, 
  Sparkles, 
  ArrowRight, 
  CheckCircle,
  Play,
  Palette,
  Zap,
  Target,
  Clock
} from 'lucide-react';

interface HowItWorksProps {
  user: User | null;
  onAuthModalOpen: () => void;
}

const steps = [
  {
    step: 1,
    title: "Enter Your Content",
    description: "Start by entering a keyword or pasting a URL from any website, YouTube video, or blog post.",
    icon: <Search className="h-6 w-6" />,
    details: [
      "Keywords: Any topic like 'digital marketing', 'healthy recipes', or 'climate change'",
      "URLs: YouTube videos, blog posts, articles, or any web content",
      "No limits on content type - our AI adapts to any subject"
    ],
    color: "from-blue-500 to-indigo-600"
  },
  {
    step: 2,
    title: "Choose Your Style",
    description: "Select from three professionally designed poster styles that best fit your content.",
    icon: <Palette className="h-6 w-6" />,
    details: [
      "Narrative: Perfect for storytelling and educational content",
      "Quote: Ideal for highlighting key messages and inspirational content",
      "Pointer: Great for lists, tips, and organized information"
    ],
    color: "from-purple-500 to-pink-600"
  },
  {
    step: 3,
    title: "AI Magic Happens",
    description: "Our advanced AI analyzes your content and creates a professional poster in seconds.",
    icon: <Sparkles className="h-6 w-6" />,
    details: [
      "Content analysis and key information extraction",
      "Automatic layout design with perfect typography",
      "Color scheme selection and visual hierarchy optimization"
    ],
    color: "from-pink-500 to-rose-600"
  },
  {
    step: 4,
    title: "Download & Share",
    description: "Get your high-quality poster instantly and share it anywhere you want.",
    icon: <Download className="h-6 w-6" />,
    details: [
      "High-resolution PNG format ready for any platform",
      "Optimized for social media, presentations, and printing",
      "Instant download with no watermarks"
    ],
    color: "from-emerald-500 to-teal-600"
  }
];

const features = [
  {
    title: "Lightning Fast",
    description: "Generate professional posters in 10-30 seconds",
    icon: <Zap className="h-6 w-6" />,
    color: "text-yellow-600"
  },
  {
    title: "AI-Powered",
    description: "Advanced algorithms understand your content context",
    icon: <Sparkles className="h-6 w-6" />,
    color: "text-purple-600"
  },
  {
    title: "Multiple Formats",
    description: "Square, portrait, and landscape options available",
    icon: <Target className="h-6 w-6" />,
    color: "text-blue-600"
  },
  {
    title: "Always Available",
    description: "24/7 access from any device, anywhere",
    icon: <Clock className="h-6 w-6" />,
    color: "text-green-600"
  }
];

export default function HowItWorks({ user, onAuthModalOpen }: HowItWorksProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <Header user={user} onAuthModalOpen={onAuthModalOpen} />

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-purple-900/80"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
              <Play className="h-4 w-4 mr-2" />
              How It Works
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              From Idea to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                Stunning Poster
              </span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              Discover how PosterSnaps transforms your content into professional visuals in just 4 simple steps.
            </p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-white text-indigo-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
            >
              Try It Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Simple, Fast, Professional
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                No design experience needed. Our AI handles all the complexity while you focus on your message.
              </p>
            </div>

            <div className="space-y-16">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                    {/* Content */}
                    <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white shadow-lg`}>
                          {step.icon}
                        </div>
                        <div>
                          <Badge variant="secondary" className="mb-2">
                            Step {step.step}
                          </Badge>
                          <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                        </div>
                      </div>
                      
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                      
                      <div className="space-y-3">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Visual */}
                    <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                      <Card className="shadow-2xl overflow-hidden">
                        <CardContent className="p-0">
                          <div className={`h-80 bg-gradient-to-br ${step.color} flex items-center justify-center text-white`}>
                            <div className="text-center">
                              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                {step.icon}
                              </div>
                              <h4 className="text-xl font-bold">Step {step.step}</h4>
                              <p className="text-white/80 mt-2">{step.title}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Connector */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-center my-12">
                      <div className="w-1 h-12 bg-gradient-to-b from-gray-300 to-gray-200 rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose PosterSnaps?
              </h2>
              <p className="text-xl text-gray-600">
                Built for speed, powered by AI, designed for everyone.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${feature.color} mx-auto mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Create Your First Poster?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of creators who are already using PosterSnaps to bring their ideas to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-white text-indigo-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                Start Creating
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/faq'}
                className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold text-white mb-2">10s</div>
                <div className="text-white/60">Average Generation Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">3</div>
                <div className="text-white/60">Professional Styles</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">∞</div>
                <div className="text-white/60">Topics Supported</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
