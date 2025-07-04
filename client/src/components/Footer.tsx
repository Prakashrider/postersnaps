import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [activeSection, setActiveSection] = useState('company');

  const handlePillClick = (section: string) => {
    setActiveSection(section);
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Footer Pills Navigation */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center bg-white rounded-full px-2 py-1 shadow-sm border border-gray-200">
              <button
                onClick={() => handlePillClick('company')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSection === 'company' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Company
              </button>
              <button
                onClick={() => handlePillClick('product')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSection === 'product' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Product
              </button>
              <button
                onClick={() => handlePillClick('support')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSection === 'support' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Support
              </button>
              <button
                onClick={() => handlePillClick('legal')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSection === 'legal' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Legal
              </button>
            </div>
          </div>
          
          {/* Links Groups */}
          <div className="w-full max-w-md">
            {/* Company Links */}
            {activeSection === 'company' && (
              <div className="text-center flex justify-center w-full">
                <div className="flex flex-wrap justify-center gap-6">
                  <Link to="/about" className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors duration-300">About Us</Link>
                  <Link to="/careers" className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors duration-300">Careers</Link>
                  <Link to="/blog" className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors duration-300">Blog</Link>
                  <Link to="/press" className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors duration-300">Press</Link>
                </div>
              </div>
            )}
            
            {/* Product Links */}
            {activeSection === 'product' && (
              <div className="text-center flex justify-center w-full">
                <div className="flex flex-wrap justify-center gap-6">
                  <Link to="/how-it-works" className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors duration-300">How It Works</Link>
                  <Link to="/pricing" className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors duration-300">Pricing</Link>
                  <Link to="/templates" className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors duration-300">Templates</Link>
                  <Link to="/api" className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors duration-300">API</Link>
                </div>
              </div>
            )}
            
            {/* Support Links */}
            {activeSection === 'support' && (
              <div className="text-center flex justify-center w-full">
                <div className="flex flex-wrap justify-center gap-6">
                  <Link to="/faq" className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors duration-300">FAQ</Link>
                  <Link to="/contact" className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors duration-300">Contact</Link>
                  <Link to="/help" className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors duration-300">Help Center</Link>
                  <Link to="/status" className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors duration-300">Status</Link>
                </div>
              </div>
            )}
            
            {/* Legal Links */}
            {activeSection === 'legal' && (
              <div className="text-center flex justify-center w-full">
                <div className="flex flex-wrap justify-center gap-6">
                  <Link to="/terms" className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors duration-300">Terms of Service</Link>
                  <Link to="/privacy" className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors duration-300">Privacy Policy</Link>
                  <Link to="/cookies" className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors duration-300">Cookie Policy</Link>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Logo and Description (Centered) */}
        <div className="flex flex-col items-center text-center border-t border-gray-200 pt-8">
          <div className="mb-6 max-w-sm mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-6 h-6">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PosterSnaps Logo" className="text-indigo-600">
                  <path
                    d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h3 className="text-gray-900 font-bold text-lg">PosterSnaps</h3>
            </div>
            <p className="text-gray-600">Transform your ideas into captivating visuals with our AI-powered poster generator.</p>
          </div>
          
          {/* Social Media Links */}
          <div className="flex justify-center space-x-4 mb-8">
            <a href="https://twitter.com/postersnaps" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors duration-300">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="https://linkedin.com/company/postersnaps" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors duration-300">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="https://github.com/prakasheswar/postersnaps" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors duration-300">
              <span className="sr-only">GitHub</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 sm:mb-0">© 2025 PosterSnaps. All rights reserved.</p>
          <div className="flex items-center">
            <span className="text-gray-500 text-xs mr-2">Made with</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-500 text-xs ml-2">by Prakash the Vibe Coder</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
