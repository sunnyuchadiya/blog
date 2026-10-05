import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "What is Wacaiki Publishing Monograph?",
    answer: "Wacaiki is a digital fashion publication and editorial studio dedicated to quiet luxury, architectural tailorship, and sustainable material innovation."
  },
  {
    question: "How can authors and contributors submit stories?",
    answer: "Editorial contributors can register an account, log into the CMS Studio, and submit draft dispatches for review by our Senior Editorial Director."
  },
  {
    question: "Are articles accessible on mobile devices?",
    answer: "Yes, Wacaiki is engineered with zero-overflow responsive design, native touch controls, and dark mode support for mobile and desktop viewports."
  },
  {
    question: "How is reader engagement calculated?",
    answer: "Verified likes, verified responses, and reader bookmarks are tracked in real-time via MongoDB Atlas analytics."
  }
];

export default function ExpandableFaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="my-16 max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-bold uppercase tracking-wider mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
          <span>Editorial FAQ</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-neutral-900 tracking-tight">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => toggleIndex(idx)}
                className="w-full text-left p-5 flex items-center justify-between font-serif font-bold text-base text-neutral-900 hover:text-indigo-600 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-sm text-neutral-600 leading-relaxed font-sans border-t border-neutral-100 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
