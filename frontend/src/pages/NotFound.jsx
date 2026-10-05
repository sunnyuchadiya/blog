import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 text-neutral-900 mb-6">
        <Compass className="w-8 h-8" />
      </div>

      <h1 className="text-5xl sm:text-6xl font-serif font-bold text-neutral-900 tracking-tight mb-4">
        404 — Edition Unreachable
      </h1>

      <p className="text-neutral-600 text-base sm:text-lg max-w-md mx-auto mb-8 leading-relaxed">
        The monograph page or dispatch you are looking for has been archived or does not exist in our current catalog.
      </p>

      <div className="flex items-center justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Journal Home</span>
        </Link>
      </div>
    </div>
  );
}
