import { User } from 'firebase/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin, Twitter, Code, Heart, Sparkles, MapPin, Calendar } from 'lucide-react';

interface AboutProps {
  user: User | null;
  onAuthModalOpen: () => void;
}

export default function About({ user, onAuthModalOpen }: AboutProps) {
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
              <Sparkles className="h-4 w-4 mr-2" />
              About PosterSnaps
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Meet the Creator Behind{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                PosterSnaps
              </span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Discover the story of innovation, creativity, and the passion for making design accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Creator Profile */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    PE
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">Prakash Eswar</h2>
                    <p className="text-gray-600 flex items-center mt-1">
                      <Code className="h-4 w-4 mr-2" />
                      AI Enthusiast & Vibe Coder
                    </p>
                    <div className="flex items-center text-gray-500 mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">Building from anywhere</span>
                    </div>
                  </div>
                </div>
                
                <div className="prose prose-lg text-gray-700 max-w-none">
                  <p className="text-lg leading-relaxed">
                    Hey there! I'm Prakash, a passionate AI enthusiast who believes in the power of "vibe coding" – 
                    that magical state where creativity meets technology, and amazing things happen.
                  </p>
                  
                  <p>
                    PosterSnaps was born from a simple frustration: creating beautiful visual content shouldn't 
                    require years of design experience or expensive software. As someone who loves exploring AI 
                    and building creative solutions, I knew there had to be a better way.
                  </p>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4">
                  <a 
                    href="https://github.com/prakasheswar" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://linkedin.com/in/prakasheswar" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://twitter.com/prakasheswar" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-400 hover:bg-blue-500 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                </div>
              </div>

              <div className="relative">
                {/* Profile image placeholder */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative bg-white rounded-2xl p-8 text-center shadow-2xl">
                    <div className="w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden shadow-xl">
                      <img 
                        src="/images/prakash-ai-coder.svg" 
                        alt="Prakash Eswar - AI Enthusiast & Creator of PosterSnaps"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-gray-600 italic text-sm">
                      "Sky is the limit!"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* The Vibe Coding Story */}
            <div className="mb-16">
              <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white mr-4">
                      <Heart className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">The "Vibe Coding" Philosophy</h3>
                  </div>
                  
                  <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                    <p>
                      "Vibe coding" isn't just a catchy phrase – it's a mindset. It's about finding that perfect 
                      flow state where you're not just writing code, but crafting experiences with AI. It's when 
                      technical challenges become creative puzzles, and every line of code feels intentional.
                    </p>
                    
                    <p>
                      Late one night, while exploring AI possibilities and working on design projects, I realized I was spending 
                      more time figuring out design tools than actually creating. That's when the idea hit me: 
                      what if AI could handle the technical design complexity, leaving humans to focus on the 
                      creative vision?
                    </p>
                    
                    <p>
                      PosterSnaps represents everything I love about vibe coding with AI – it's elegant, purposeful, 
                      and solves a real problem. Every feature is designed with empathy for creators who just 
                      want to bring their ideas to life without getting bogged down in technical details.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tech Stack & Skills */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Built With Modern Technologies</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Frontend</h4>
                    <div className="space-y-2">
                      <Badge variant="secondary">React</Badge>
                      <Badge variant="secondary">TypeScript</Badge>
                      <Badge variant="secondary">Tailwind CSS</Badge>
                      <Badge variant="secondary">Vite</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Backend</h4>
                    <div className="space-y-2">
                      <Badge variant="secondary">Node.js</Badge>
                      <Badge variant="secondary">Express</Badge>
                      <Badge variant="secondary">OpenAI API</Badge>
                      <Badge variant="secondary">Firebase</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">AI & Tools</h4>
                    <div className="space-y-2">
                      <Badge variant="secondary">GPT-4</Badge>
                      <Badge variant="secondary">Web Scraping</Badge>
                      <Badge variant="secondary">HTML Canvas</Badge>
                      <Badge variant="secondary">Puppeteer</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Vision & Mission */}
            <div className="text-center">
              <Card className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white border-0">
                <CardContent className="p-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-bold">Vision for the Future</h3>
                  </div>
                  
                  <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                    My vision is to democratize visual content creation through AI. Whether you're a small business owner, 
                    educator, content creator, or someone with a great idea but no design background, 
                    PosterSnaps should be your creative AI partner. Together, we're building a world where 
                    great ideas can be beautifully expressed by anyone, anywhere, with the power of artificial intelligence.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
