import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { useState } from 'react';
import { User } from 'firebase/auth';
import { useAuthState } from '@/lib/firebase';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import HowItWorks from './pages/HowItWorks';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/not-found';
import AuthModal from './components/AuthModal';

const queryClient = new QueryClient();

function App() {
  const [user] = useAuthState();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
          <Routes>
            <Route path="/" element={<Home user={user} onAuthModalOpen={() => setAuthModalOpen(true)} />} />
            <Route path="/about" element={<About user={user} onAuthModalOpen={() => setAuthModalOpen(true)} />} />
            <Route path="/contact" element={<Contact user={user} onAuthModalOpen={() => setAuthModalOpen(true)} />} />
            <Route path="/faq" element={<FAQ user={user} onAuthModalOpen={() => setAuthModalOpen(true)} />} />
            <Route path="/how-it-works" element={<HowItWorks user={user} onAuthModalOpen={() => setAuthModalOpen(true)} />} />
            <Route path="/blog" element={<Blog user={user} onAuthModalOpen={() => setAuthModalOpen(true)} />} />
            <Route path="/blog/:slug" element={<BlogPost user={user} onAuthModalOpen={() => setAuthModalOpen(true)} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            onSuccess={() => setAuthModalOpen(false)}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
