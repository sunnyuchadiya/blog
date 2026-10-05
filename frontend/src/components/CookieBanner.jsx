import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';

export default function CookieBanner() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem('wacaiki_cookie_consent');
    if (!consent) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('wacaiki_cookie_consent', 'accepted');
    setAccepted(true);
  };

  const handleDecline = () => {
    localStorage.setItem('wacaiki_cookie_consent', 'declined');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-toast no-print">
      <div className="bg-neutral-950 text-white p-5 rounded-3xl shadow-2xl border border-neutral-800 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <Cookie className="w-4 h-4" />
            <span>Cookie Consent & Privacy</span>
          </div>
          <button
            onClick={handleDecline}
            className="p-1 text-neutral-400 hover:text-white rounded-full"
            aria-label="Close cookie banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed">
          We use minimal cookies and local storage to personalize your reading experience, remember dark mode preferences, and secure your session.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAccept}
            className="flex-1 py-2 px-4 rounded-full bg-white text-neutral-950 text-xs font-semibold hover:bg-neutral-200 transition-colors"
          >
            Accept Cookies
          </button>
          <button
            onClick={handleDecline}
            className="py-2 px-4 rounded-full bg-neutral-800 text-neutral-300 text-xs font-semibold hover:bg-neutral-700 transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
