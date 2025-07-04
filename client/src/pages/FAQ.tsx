import { useState } from 'react';
import { User } from 'firebase/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Search, HelpCircle, MessageCircle, Star, Zap, Shield, Download } from 'lucide-react';

interface FAQProps {
  user: User | null;
  onAuthModalOpen: () => void;
}

const faqData = [
  {
    category: "Getting Started",
    icon: <Zap className="h-5 w-5" />,
    questions: [
      {
        question: "How do I create my first poster?",
        answer: "Creating your first poster is easy! Simply enter a keyword or paste a URL in the input field on our homepage, choose your preferred style (narrative, quote, or pointer), and click 'Generate Poster'. Our AI will create a professional-looking poster for you in seconds."
      },
      {
        question: "What types of content can I use?",
        answer: "You can use any keyword, topic, or URL from websites, YouTube videos, blog posts, or articles. Our AI extracts the key information and creates relevant visual content. Popular topics include business tips, educational content, quotes, and marketing materials."
      },
      {
        question: "Do I need design experience?",
        answer: "Not at all! PosterSnaps is designed for everyone, regardless of design experience. Our AI handles all the design work, typography, and layout automatically. You just need to provide the content or topic."
      }
    ]
  },
  {
    category: "Features & Pricing",
    icon: <Star className="h-5 w-5" />,
    questions: [
      {
        question: "How much does PosterSnaps cost?",
        answer: "We offer a free tier that allows you to create a limited number of posters. For unlimited access and premium features, we have affordable paid plans starting at $9.99/month. You can also purchase credits for one-time use."
      },
      {
        question: "What poster styles are available?",
        answer: "We offer three main styles: Narrative (great for storytelling and educational content), Quote (perfect for highlighting key messages), and Pointer (ideal for lists and bullet points). Each style comes in multiple formats including square, portrait, and landscape."
      },
      {
        question: "Can I customize the generated posters?",
        answer: "Currently, our AI creates optimized designs automatically. However, we're working on customization features that will allow you to adjust colors, fonts, and layouts. This feature will be available in our premium plans."
      }
    ]
  },
  {
    category: "Technical",
    icon: <Download className="h-5 w-5" />,
    questions: [
      {
        question: "What file formats do you support?",
        answer: "All posters are generated in high-quality PNG format, perfect for social media, presentations, and printing. We're working on adding JPG and PDF export options for premium users."
      },
      {
        question: "How long does it take to generate a poster?",
        answer: "Most posters are generated within 10-30 seconds, depending on the complexity of the content and current server load. You'll see a progress indicator while your poster is being created."
      },
      {
        question: "Can I use PosterSnaps on mobile devices?",
        answer: "Yes! PosterSnaps is fully responsive and works great on smartphones and tablets. The interface is optimized for touch interactions and mobile browsing."
      }
    ]
  },
  {
    category: "Account & Security",
    icon: <Shield className="h-5 w-5" />,
    questions: [
      {
        question: "Do I need to create an account?",
        answer: "You can try PosterSnaps without an account for a limited number of posters. Creating a free account allows you to save your creations, track your usage, and access additional features."
      },
      {
        question: "Is my data secure?",
        answer: "Absolutely! We use industry-standard encryption and security practices. Your data is never shared with third parties, and we only use your content to generate your posters. All data is processed securely and deleted after processing."
      },
      {
        question: "Can I delete my account?",
        answer: "Yes, you can delete your account at any time from your profile settings. This will permanently remove all your data and generated posters from our servers."
      }
    ]
  }
];

export default function FAQ({ user, onAuthModalOpen }: FAQProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFAQs = faqData.filter(category => {
    if (selectedCategory !== 'all' && category.category !== selectedCategory) {
      return false;
    }
    
    if (searchTerm) {
      return category.questions.some(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return true;
  });

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
              <HelpCircle className="h-4 w-4 mr-2" />
              Frequently Asked Questions
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Got{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                Questions?
              </span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Find answers to common questions about PosterSnaps and learn how to make the most of our AI-powered poster generator.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  All
                </Button>
                {faqData.map((category) => (
                  <Button
                    key={category.category}
                    variant={selectedCategory === category.category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.category)}
                  >
                    {category.category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No matching questions found</h3>
                  <p className="text-gray-600">Try adjusting your search or browse all categories.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {filteredFAQs.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-3">
                        {category.icon}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
                      <Badge variant="secondary" className="ml-3">
                        {category.questions.length} question{category.questions.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    <Card className="shadow-lg">
                      <CardContent className="p-0">
                        <Accordion type="single" collapsible className="w-full">
                          {category.questions.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                              <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50">
                                <span className="font-medium text-gray-900">{faq.question}</span>
                              </AccordionTrigger>
                              <AccordionContent className="px-6 pb-4">
                                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
            <p className="text-white/80 mb-6">
              Can't find what you're looking for? Our support team is here to help you get the most out of PosterSnaps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/contact'}
                className="bg-white text-indigo-900 hover:bg-gray-100"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="border-white text-white hover:bg-white/10"
              >
                Try PosterSnaps
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
