import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full px-4 animate-toast">
      <div className={`flex items-start gap-3 p-4 rounded-2xl shadow-xl border ${
        isSuccess 
          ? 'bg-neutral-900 border-neutral-800 text-white' 
          : 'bg-red-950 border-red-800 text-red-100'
      }`}>
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        )}

        <div className="flex-1 text-sm font-medium pr-2">
          {toast.message}
        </div>

        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-neutral-800"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
