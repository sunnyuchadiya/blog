import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Footer({ showToast, currentUser }) {
  const [email, setEmail] = useState('');
  const currentYear = new Date().getFullYear();
  const isAdmin = currentUser?.role === 'Editorial Director';

  const handleSubscribe = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Thank you for subscribing to Wacaiki Editorial!', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-neutral-950 text-white pt-16 pb-12 border-t border-neutral-900 mt-20">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-neutral-800">
          
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link to="/" className="text-3xl font-bold font-serif tracking-tight text-white flex items-center gap-2">
              <span className="w-9 h-9 rounded-full bg-white text-neutral-950 flex items-center justify-center font-serif text-xl font-bold">
                W
              </span>
              <span>Wacaiki</span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              Wacaiki is a modern fashion editorial and monograph platform celebrating high craft, quiet luxury, and architectural design.
            </p>

            {/* Clickable Contact Details */}
            <div className="flex flex-col gap-2.5 pt-2 text-sm text-neutral-300">
              <a 
                href="mailto:editorial@wacaiki.com" 
                className="inline-flex items-center gap-2.5 hover:text-white transition-colors group"
                aria-label="Email Wacaiki Editorial"
              >
                <Mail className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="underline decoration-neutral-700 underline-offset-4 hover:decoration-white">
                  editorial@wacaiki.com
                </span>
              </a>

              <a 
                href="tel:+15558923410" 
                className="inline-flex items-center gap-2.5 hover:text-white transition-colors group"
                aria-label="Call Wacaiki Desk"
              >
                <Phone className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="underline decoration-neutral-700 underline-offset-4 hover:decoration-white">
                  +1 (555) 892-3410
                </span>
              </a>

              <div className="inline-flex items-center gap-2.5 text-neutral-400">
                <MapPin className="w-4 h-4 text-neutral-500" />
                <span>Rue du Faubourg Saint-Honoré, Paris</span>
              </div>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4 font-sans">
                Navigation
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/" className="text-neutral-300 hover:text-white transition-colors">Home</Link>
                </li>
                <li>
                  <Link to="/?category=Trends" className="text-neutral-300 hover:text-white transition-colors">Trends</Link>
                </li>
                <li>
                  <Link to="/?category=Fashion" className="text-neutral-300 hover:text-white transition-colors">Fashion</Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link to="/cms" className="text-neutral-300 hover:text-white transition-colors">CMS Studio</Link>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4 font-sans">
                Editorial
              </h4>
              <ul className="space-y-2.5 text-sm">
                {isAdmin ? (
                  <li>
                    <Link to="/cms/new" className="text-neutral-300 hover:text-white transition-colors">New Story</Link>
                  </li>
                ) : (
                  <li>
                    <Link to="/login" className="text-neutral-300 hover:text-white transition-colors">Admin Sign In</Link>
                  </li>
                )}
                <li>
                  <Link to="/article/1" className="text-neutral-300 hover:text-white transition-colors">Featured Issue</Link>
                </li>
                <li>
                  <a href="#newsletter" className="text-neutral-300 hover:text-white transition-colors">Newsletter</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Subscription (5 cols) */}
          <div className="lg:col-span-5" id="newsletter">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-2 font-sans">
              Join the Wacaiki Dispatch
            </h4>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Receive weekly curations on modern fashion, runway critiques, and architectural craftsmanship straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 px-4 py-3 rounded-full bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-neutral-950 hover:bg-neutral-200 text-sm font-semibold transition-colors shrink-0"
              >
                <span>Subscribe</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div>
            © {currentYear} Wacaiki Publishing Co. All rights reserved. Crafted with elegance.
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-neutral-300 transition-colors">Terms of Service</Link>
            <Link to={currentUser ? "/cms" : "/login"} className="hover:text-neutral-300 transition-colors">
              {isAdmin ? "CMS Access" : "Staff Sign In"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
