import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User } from 'firebase/auth';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowLeft, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';

interface BlogPostProps {
  user: User | null;
  onAuthModalOpen: () => void;
}

// Blog posts data - same as in Blog.tsx, in a real app this would be fetched from an API
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
      
      <h2>Looking Ahead</h2>
      <p>The future of AI-powered design is incredibly bright. As machine learning algorithms become more sophisticated, we can expect even more personalized and contextually aware design tools. PosterSnaps is at the forefront of this revolution, continuously improving our AI to serve our users better.</p>
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
      
      <h2>6. Choose the Right Typography</h2>
      <p>Select fonts that are easy to read and match your brand personality. Avoid using too many different fonts.</p>
      
      <h2>7. Create Visual Hierarchy</h2>
      <p>Use size, color, and positioning to guide the viewer's eye through your poster in the order you want.</p>
      
      <h2>8. Include Contact Information</h2>
      <p>Make it easy for interested viewers to reach you. Include your website, phone number, or social media handles.</p>
      
      <h2>9. Test Different Versions</h2>
      <p>Create multiple versions of your poster and test which one performs better with your target audience.</p>
      
      <h2>10. Optimize for Your Medium</h2>
      <p>Consider where your poster will be displayed and optimize accordingly. Digital posters have different requirements than print ones.</p>
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
      
      <h2>Secondary Colors and Their Impact</h2>
      <ul>
        <li><strong>Green:</strong> Associated with nature, growth, and money. Great for environmental and financial brands.</li>
        <li><strong>Orange:</strong> Energetic and friendly, perfect for creative and playful brands.</li>
        <li><strong>Purple:</strong> Luxurious and mysterious, ideal for premium and creative brands.</li>
      </ul>
      
      <h2>Using Color Combinations Effectively</h2>
      <p>Understanding color harmony helps create visually appealing posters. Consider complementary colors for high contrast or analogous colors for harmony.</p>
      
      <h2>Cultural Considerations</h2>
      <p>Remember that color meanings can vary across cultures. What works in one market might not work in another, so always consider your audience's cultural background.</p>
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
      
      <h2>The Social Media Boom</h2>
      <p>Social media platforms democratized content distribution but increased the demand for visual content. Businesses needed more graphics, videos, and interactive content than ever before.</p>
      
      <h2>The AI Era</h2>
      <p>Today, AI tools like PosterSnaps are democratizing content creation. Anyone can create professional-quality marketing materials without extensive design knowledge or expensive software.</p>
      
      <h2>What's Next?</h2>
      <p>The future promises even more personalized, dynamic content that adapts to individual preferences and behaviors in real-time. AI will continue to lower barriers to entry while raising the bar for quality and personalization.</p>
      
      <h2>Preparing for the Future</h2>
      <p>To stay competitive, businesses need to embrace AI-powered tools while maintaining their unique brand voice and message. The key is to use technology to amplify creativity, not replace it.</p>
    `,
    author: "Prakash Eswar",
    date: "2024-01-01",
    readTime: "8 min read",
    tags: ["Digital Marketing", "History", "AI", "Future"],
    image: "/blog-marketing-evolution.jpg",
    slug: "evolution-digital-marketing"
  }
];

export default function BlogPost({ user, onAuthModalOpen }: BlogPostProps) {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    if (post) {
      // Update page title and meta description for SEO
      document.title = `${post.title} - PosterSnaps Blog`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.excerpt);
      }
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header user={user} onAuthModalOpen={onAuthModalOpen} />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
            <Link 
              to="/blog" 
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/blog/${post.slug}`;
  const shareText = `Check out this article: ${post.title}`;

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} onAuthModalOpen={onAuthModalOpen} />
      
      <article className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back to Blog */}
            <Link 
              to="/blog" 
              className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>

            {/* Article Header */}
            <header className="mb-12">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex items-center gap-6 text-gray-600 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>By {post.author}</span>
                </div>
              </div>

              {/* Featured Image */}
              <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl relative overflow-hidden mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">📝</span>
                    </div>
                    <p className="text-lg opacity-80">Featured Image</p>
                  </div>
                </div>
              </div>
            </header>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                lineHeight: '1.8',
                fontSize: '1.1rem',
                color: '#374151'
              }}
            />

            {/* Share Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Share this article</h3>
                  <p className="text-gray-600">Help others discover this content</p>
                </div>
                <div className="flex gap-4">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {blogPosts
                .filter(p => p.id !== post.id)
                .slice(0, 2)
                .map((relatedPost) => (
                  <div key={relatedPost.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-2xl">📝</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 leading-tight">
                        <Link 
                          to={`/blog/${relatedPost.slug}`}
                          className="hover:text-indigo-600 transition-colors"
                        >
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-4">{relatedPost.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{new Date(relatedPost.date).toLocaleDateString()}</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
