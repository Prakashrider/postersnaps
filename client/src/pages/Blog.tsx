import { useEffect } from 'react';
import { User } from 'firebase/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogProps {
  user: User | null;
  onAuthModalOpen: () => void;
}

// Blog posts data - in a real app, this would come from a CMS or database
const blogPosts = [
  {
    id: 1,
    title: "The Future of AI-Powered Design: How PosterSnaps is Revolutionizing Visual Content Creation",
    excerpt: "Explore how artificial intelligence is transforming the design landscape and making professional poster creation accessible to everyone.",
    content: `
      <p>In today's fast-paced digital world, the demand for high-quality visual content has never been higher. From social media posts to business presentations, everyone needs eye-catching graphics. However, not everyone has the design skills or budget to hire professional designers. This is where AI-powered tools like PosterSnaps are making a significant impact.</p>
      
      <h2>The Traditional Design Challenge</h2>
      <p>Creating professional posters traditionally required:</p>
      <ul>
        <li>Expensive design software</li>
        <li>Years of design experience</li>
        <li>Understanding of color theory and typography</li>
        <li>Access to high-quality images and fonts</li>
      </ul>
      
      <h2>How AI Changes Everything</h2>
      <p>With PosterSnaps, artificial intelligence handles the complex design decisions, allowing users to focus on their message rather than technical details. Our AI understands design principles, color harmony, and layout composition to create stunning posters in seconds.</p>
      
      <h2>The Impact on Businesses</h2>
      <p>Small businesses can now compete with larger companies in terms of visual marketing. Our AI-powered poster generator democratizes design, making professional-quality graphics accessible to everyone.</p>
    `,
    author: "Prakash Eswar",
    date: "2024-01-15",
    readTime: "5 min read",
    tags: ["AI", "Design", "Technology", "Business"],
    image: "/blog-ai-design.jpg",
    slug: "future-of-ai-powered-design"
  },
  {
    id: 2,
    title: "10 Tips for Creating Effective Marketing Posters That Convert",
    excerpt: "Learn the essential principles of poster design that grab attention and drive action from your audience.",
    content: `
      <p>Creating effective marketing posters is both an art and a science. Whether you're promoting an event, product, or service, your poster needs to capture attention and motivate action. Here are 10 proven tips to make your posters more effective.</p>
      
      <h2>1. Start with a Clear Message</h2>
      <p>Your poster should communicate its main message within 3 seconds. Use clear, concise text that tells viewers exactly what you're offering.</p>
      
      <h2>2. Use High-Contrast Colors</h2>
      <p>Colors that contrast well ensure your text is readable from a distance. Dark text on light backgrounds or vice versa works best.</p>
      
      <h2>3. Include a Strong Call-to-Action</h2>
      <p>Tell your audience exactly what you want them to do: "Visit our website," "Call now," or "Register today."</p>
      
      <h2>4. Keep It Simple</h2>
      <p>Avoid cluttering your poster with too much information. Focus on the most important details.</p>
      
      <h2>5. Use Quality Images</h2>
      <p>High-resolution images make your poster look professional and trustworthy.</p>
    `,
    author: "Prakash Eswar",
    date: "2024-01-10",
    readTime: "7 min read",
    tags: ["Marketing", "Design Tips", "Conversion"],
    image: "/blog-marketing-tips.jpg",
    slug: "effective-marketing-posters-tips"
  },
  {
    id: 3,
    title: "Understanding Color Psychology in Poster Design",
    excerpt: "Discover how different colors affect emotions and behavior, and learn to use color strategically in your poster designs.",
    content: `
      <p>Color is one of the most powerful tools in a designer's arsenal. It can evoke emotions, influence decisions, and create memorable experiences. Understanding color psychology is crucial for creating effective posters that resonate with your audience.</p>
      
      <h2>The Science Behind Color Psychology</h2>
      <p>Colors trigger psychological responses that are often subconscious. This happens because we associate certain colors with experiences, emotions, and concepts throughout our lives.</p>
      
      <h2>Primary Colors and Their Effects</h2>
      <ul>
        <li><strong>Red:</strong> Creates urgency, excitement, and passion. Great for sales and calls-to-action.</li>
        <li><strong>Blue:</strong> Conveys trust, reliability, and professionalism. Perfect for business and healthcare.</li>
        <li><strong>Yellow:</strong> Represents happiness, optimism, and energy. Ideal for youth-oriented brands.</li>
      </ul>
      
      <h2>Using Color Combinations Effectively</h2>
      <p>Understanding color harmony helps create visually appealing posters. Consider complementary colors for high contrast or analogous colors for harmony.</p>
    `,
    author: "Prakash Eswar",
    date: "2024-01-05",
    readTime: "6 min read",
    tags: ["Color Theory", "Psychology", "Design"],
    image: "/blog-color-psychology.jpg",
    slug: "color-psychology-poster-design"
  },
  {
    id: 4,
    title: "The Evolution of Digital Marketing: From Print to AI-Generated Content",
    excerpt: "Trace the journey of marketing materials from traditional print media to modern AI-generated content and what it means for the future.",
    content: `
      <p>Marketing has undergone a dramatic transformation over the past few decades. From traditional print advertisements to AI-generated content, the landscape has evolved at breakneck speed. Let's explore this fascinating journey.</p>
      
      <h2>The Print Era</h2>
      <p>For decades, print was king. Newspapers, magazines, and billboards dominated the marketing landscape. Creating marketing materials required significant time, money, and expertise.</p>
      
      <h2>The Digital Revolution</h2>
      <p>The internet changed everything. Digital marketing opened new channels and made it easier to reach targeted audiences. However, creating quality content still required substantial resources.</p>
      
      <h2>The AI Era</h2>
      <p>Today, AI tools like PosterSnaps are democratizing content creation. Anyone can create professional-quality marketing materials without extensive design knowledge or expensive software.</p>
      
      <h2>What's Next?</h2>
      <p>The future promises even more personalized, dynamic content that adapts to individual preferences and behaviors in real-time.</p>
    `,
    author: "Prakash Eswar",
    date: "2024-01-01",
    readTime: "8 min read",
    tags: ["Digital Marketing", "History", "AI", "Future"],
    image: "/blog-marketing-evolution.jpg",
    slug: "evolution-digital-marketing"
  }
];

export default function Blog({ user, onAuthModalOpen }: BlogProps) {
  useEffect(() => {
    // Update page title and meta description for SEO
    document.title = "Blog - PosterSnaps | AI Design Tips, Marketing Insights & More";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover expert tips on AI-powered design, marketing strategies, and poster creation. Learn from industry insights and stay ahead with PosterSnaps blog.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} onAuthModalOpen={onAuthModalOpen} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              PosterSnaps Blog
            </h1>
            <p className="text-xl md:text-2xl text-indigo-200 mb-8">
              Insights, tips, and trends in AI-powered design and marketing
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">AI Design</Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">Marketing Tips</Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">Color Psychology</Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">Business Growth</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
                  {/* Placeholder for blog image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-2xl">📝</span>
                      </div>
                      <p className="text-sm opacity-80">Blog Image</p>
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{post.readTime}</span>
                  </div>
                  <CardTitle className="text-xl leading-tight hover:text-indigo-600 transition-colors">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Link 
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Read more <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-gray-600 mb-8">
              Get the latest insights on AI-powered design, marketing tips, and exclusive content delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
