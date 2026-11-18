import React from 'react';
import { ArrowRight, MessageSquareText, Sparkles, PhoneCall, ShieldCheck } from 'lucide-react';

interface LandingHeroProps {
  onStart: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStart }) => {
  return (
    <div className="max-w-3xl mx-auto text-center py-8 sm:py-16">
      {/* Decorative Badge */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs sm:text-sm font-medium mb-6 animate-fade-in">
        <Sparkles className="w-4 h-4 text-teal-600" />
        <span>Intelligent Student Triage & Routing</span>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight mb-4">
        Find the Right Support
      </h1>

      {/* Subheading */}
      <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
        Tell us what's going on. We'll help you find the university support
        service that may be most relevant.
      </p>

      {/* Primary CTA */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onStart}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-base shadow-sm hover:shadow transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          <span>Find Support</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Reassurance text */}
      <p className="text-sm text-slate-500 max-w-md mx-auto leading-normal mb-14">
        You can describe your situation in your own words. You don't need to know
        which department to contact.
      </p>

      {/* 3 Value Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-6 border-t border-slate-200/80">
        <div className="p-4 rounded-xl bg-white border border-slate-200/70 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
            <MessageSquareText className="w-5 h-5" />
          </div>
          <h2 className="font-semibold text-slate-900 text-sm mb-1">
            Natural Explanation
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Write naturally without having to figure out administrative divisions beforehand.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/70 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="font-semibold text-slate-900 text-sm mb-1">
            Multi-Need Triage
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Understands overlapping concerns across wellbeing, academic study, and finances.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/70 shadow-xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h2 className="font-semibold text-slate-900 text-sm mb-1">
            Direct Routing
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Instantly provides the dedicated phone line and contact instructions for the service.
          </p>
        </div>
      </div>

      {/* Privacy note */}
      <div className="mt-8 flex items-center justify-center space-x-1.5 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-slate-400" />
        <span>No login or student profile required. Free and confidential navigation.</span>
      </div>
    </div>
  );
};
