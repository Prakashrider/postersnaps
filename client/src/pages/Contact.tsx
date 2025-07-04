import { useState } from 'react';
import { User } from 'firebase/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, MessageCircle, Phone, MapPin, Clock, Send } from 'lucide-react';

interface ContactProps {
  user: User | null;
  onAuthModalOpen: () => void;
}

export default function Contact({ user, onAuthModalOpen }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
        variant: "default",
      });
      
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <MessageCircle className="h-4 w-4 mr-2" />
              Get in Touch
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Let's{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                Connect
              </span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Have questions, suggestions, or just want to say hello? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Whether you have a question about features, need technical support, or want to 
                    collaborate, our team is here to help. We typically respond within 24 hours.
                  </p>
                </div>

                {/* Contact Methods */}
                <div className="space-y-6">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-4">
                          <Mail className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Email</h3>
                          <p className="text-gray-600">hello@postersnaps.com</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4">
                          <MessageCircle className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Live Chat</h3>
                          <p className="text-gray-600">Available 9 AM - 6 PM PST</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
                          <Clock className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Response Time</h3>
                          <p className="text-gray-600">Usually within 24 hours</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* FAQ Link */}
                <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Common Questions?</h3>
                    <p className="text-gray-600 mb-4">
                      Check out our FAQ section for quick answers to the most frequently asked questions.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.href = '/faq'}
                      className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                    >
                      Visit FAQ
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div>
                <Card className="shadow-xl">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Name *
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="mt-1"
                            placeholder="Your full name"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email *
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="mt-1"
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                          Subject *
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                          placeholder="What's this about?"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                          Message *
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={6}
                          className="mt-1"
                          placeholder="Tell us more about your question or feedback..."
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 py-3"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
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
