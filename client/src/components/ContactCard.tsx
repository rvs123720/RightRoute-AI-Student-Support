import React, { useState } from 'react';
import {
  PhoneCall,
  ArrowLeft,
  RotateCcw,
  Copy,
  Check,
  Building2,
  Clock,
} from 'lucide-react';
import { TriageRecommendation } from '../types/support';
import { getCategoryTheme } from '../utils/serviceIcons';

interface ContactCardProps {
  recommendation: TriageRecommendation;
  onBackToRecommendations: () => void;
  onStartOver: () => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({
  recommendation,
  onBackToRecommendations,
  onStartOver,
}) => {
  const [copied, setCopied] = useState(false);
  const theme = getCategoryTheme(recommendation.category);
  const IconComponent = theme.icon;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(recommendation.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 animate-fade-in">
      {/* Back button navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBackToRecommendations}
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to recommendations</span>
        </button>

        <button
          onClick={onStartOver}
          className="inline-flex items-center space-x-1 text-xs sm:text-sm font-medium text-slate-500 hover:text-teal-700 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Start over</span>
        </button>
      </div>

      {/* Main Contact Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Banner */}
        <div className="p-6 sm:p-8 border-b border-slate-100 bg-linear-to-b from-slate-50 to-white">
          <div className="flex items-center space-x-4 mb-4">
            <div
              className={`w-14 h-14 rounded-2xl ${theme.iconBg} ${theme.iconColor} flex items-center justify-center shrink-0 border ${theme.borderColor}`}
            >
              <IconComponent className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Direct Contact Pathway
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Connect with {recommendation.service}
              </h1>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {recommendation.description}
          </p>
        </div>

        {/* Contact Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Why you're being routed here */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
              Referral Context
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "{recommendation.reason}"
            </p>
          </div>

          {/* Primary Phone Section */}
          <div className="p-6 rounded-2xl bg-teal-50/60 border border-teal-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                Phone Contact
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                {recommendation.phone}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Mon – Fri: 9:00 AM – 5:00 PM (Emergency lines active 24/7)</span>
              </p>
            </div>

            <div className="flex flex-row sm:flex-col items-center gap-2 w-full sm:w-auto">
              {/* Primary Call Button with tel: scheme */}
              <a
                href={`tel:${recommendation.phone.replace(/[^0-9+]/g, '')}`}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm sm:text-base shadow-sm transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call Service</span>
              </a>

              {/* Copy Phone Number */}
              <button
                type="button"
                onClick={handleCopyPhone}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium transition-colors"
                title="Copy phone number to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy number</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Practical Next Steps */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-2">
            <h3 className="text-xs font-semibold text-slate-900 flex items-center space-x-1.5">
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>What to expect when you contact</span>
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>You can speak directly with a dedicated university advisor.</li>
              <li>Explain what you're experiencing; they will guide you through relevant options.</li>
              <li>Calls are confidential and handled under student support guidelines.</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Example university services shown for demonstration.</span>
          <div className="flex items-center space-x-3">
            <button
              onClick={onBackToRecommendations}
              className="text-slate-700 hover:text-teal-700 font-medium hover:underline"
            >
              Choose another service
            </button>
            <span>•</span>
            <button
              onClick={onStartOver}
              className="text-slate-700 hover:text-teal-700 font-medium hover:underline"
            >
              Start over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
