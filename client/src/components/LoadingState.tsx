import React from 'react';
import { Compass } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="max-w-md mx-auto py-16 px-4 text-center flex flex-col items-center justify-center animate-fade-in"
    >
      {/* Animated Compass / Ring */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center shadow-inner">
          <Compass className="w-8 h-8 text-teal-600 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <div className="absolute -inset-1 rounded-2xl bg-teal-400/20 blur-sm animate-pulse -z-10" />
      </div>

      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        Understanding your concern...
      </h2>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
        Reviewing your situation to match relevant university support services.
      </p>

      {/* Subtle indicator bar */}
      <div className="w-48 h-1.5 bg-slate-100 rounded-full mt-6 overflow-hidden">
        <div className="w-full h-full bg-teal-500 rounded-full animate-pulse" />
      </div>
    </div>
  );
};
