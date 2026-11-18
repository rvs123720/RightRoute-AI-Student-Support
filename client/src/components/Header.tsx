import React from 'react';
import { Compass, BookOpen, RotateCcw } from 'lucide-react';
import { ViewScreen } from '../types/support';

interface HeaderProps {
  currentView: ViewScreen;
  onReset: () => void;
  onOpenDirectory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onReset,
  onOpenDirectory,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={onReset}
          className="flex items-center space-x-3 text-left group focus:outline-none"
          aria-label="Student Support Navigator Home"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm group-hover:bg-teal-700 transition-colors">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-900 tracking-tight text-base sm:text-lg">
                Student Support Navigator
              </span>
              <span className="hidden sm:inline-flex text-[11px] font-medium uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                Track 1
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              University Triage & Routing
            </p>
          </div>
        </button>

        {/* Header Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenDirectory}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            title="Browse all 12 university support services"
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span>Service Directory</span>
          </button>

          {currentView !== 'landing' && currentView !== 'input' && (
            <button
              onClick={onReset}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Start Over</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
