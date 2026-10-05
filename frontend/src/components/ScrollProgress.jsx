import React, { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';

export default function ScrollProgress() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const currentScroll = window.scrollY;
      
      if (totalHeight > 0) {
        setScrollPercentage((currentScroll / totalHeight) * 100);
      }
      
      setShowBackToTop(currentScroll > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll Progress Bar at very top */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none no-print">
        <div 
          className="h-full bg-indigo-600 transition-all duration-150" 
          style={{ width: `${scrollPercentage}%` }}
        />
      </div>

      {/* Floating Action Cluster: Back to Top & Quick Floating Contact */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 no-print">
        
        {/* Floating Quick Contact Button */}
        <a
          href="mailto:editorial@wacaiki.com"
          className="w-12 h-12 rounded-full bg-neutral-950 text-white border border-neutral-800 shadow-xl flex items-center justify-center hover:scale-105 transition-all group"
          title="Contact Wacaiki Editorial"
          aria-label="Contact Wacaiki Editorial"
        >
          <MessageCircle className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
        </a>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full bg-white text-neutral-900 border border-neutral-200 shadow-xl flex items-center justify-center hover:bg-neutral-950 hover:text-white transition-all animate-toast"
            title="Back to top"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

      </div>
    </>
  );
}
