import React from 'react';
import { HelpCircle, AlertCircle, RotateCcw, PhoneCall } from 'lucide-react';

interface ErrorStateProps {
  type: 'unclear' | 'api_error';
  message?: string;
  onTryAgain: () => void;
  onOpenDirectory?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  type,
  message,
  onTryAgain,
  onOpenDirectory,
}) => {
  if (type === 'unclear') {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-7 h-7" />
        </div>

       <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
  {message?.startsWith("I'm Student Support Navigator")
    ? "I'm Student Support Navigator."
    : "We’d like a little more information."}
</h2>

<p className="text-sm text-slate-600 leading-relaxed mb-6">
  {message?.startsWith("I'm Student Support Navigator")
    ? message
    : message ||
      "Tell us a little more about what you're dealing with so we can point you toward the most relevant support."}
</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onTryAgain}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          {onOpenDirectory && (
            <button
              onClick={onOpenDirectory}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-sm font-medium transition-colors cursor-pointer"
            >
              Browse All Services
            </button>
          )}
        </div>
      </div>
    );
  }

  // API Error state
  return (
    <div className="max-w-md mx-auto py-12 px-4 text-center animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-7 h-7 text-slate-500" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
        We couldn't process your request right now.
      </h2>

      <p className="text-sm text-slate-600 leading-relaxed mb-6">
        Please try again, or contact the university's general student support service.
      </p>

      {/* General student support direct line */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 text-left">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
          General Student Support
        </span>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-800 text-sm">
            +91 98765 43209 (Student Affairs)
          </span>
          <a
            href="tel:+919876543209"
            className="inline-flex items-center space-x-1 text-xs text-teal-700 font-semibold hover:underline"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call</span>
          </a>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onTryAgain}
          className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
};
