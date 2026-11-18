import React from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { TriageRecommendation } from '../types/support';
import { getCategoryTheme } from '../utils/serviceIcons';

interface RecommendationCardProps {
  recommendation: TriageRecommendation;
  rank: number;
  onSelect: (recommendation: TriageRecommendation) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  rank,
  onSelect,
}) => {
  const theme = getCategoryTheme(recommendation.category);
  const IconComponent = theme.icon;

  const relevanceBadge = {
    high: {
      text: 'High Relevance',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    medium: {
      text: 'Medium Relevance',
      className: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    low: {
      text: 'Low Relevance',
      className: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  }[recommendation.relevance] || {
    text: 'Relevant',
    className: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 p-5 sm:p-6 shadow-xs hover:shadow-sm transition-all duration-150 flex flex-col justify-between">
      <div>
        {/* Top bar: Rank, Category Icon, Relevance Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 rounded-xl ${theme.iconBg} ${theme.iconColor} flex items-center justify-center shrink-0 border ${theme.borderColor}`}
            >
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-400">
                  Option {rank}
                </span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs font-medium text-slate-500 capitalize">
                  {theme.label}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {recommendation.service}
              </h2>
            </div>
          </div>

          <span
            className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${relevanceBadge.className}`}
          >
            {relevanceBadge.text}
          </span>
        </div>

        {/* Short service description */}
        <p className="text-xs sm:text-sm text-slate-500 mb-4 leading-relaxed">
          {recommendation.description}
        </p>

        {/* Why this may help section */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 mb-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600 mb-1">
            Why this may help
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
            "{recommendation.reason}"
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
        <span className="text-xs text-slate-400 font-medium flex items-center space-x-1">
          <Phone className="w-3.5 h-3.5" />
          <span>Phone contact available</span>
        </span>

        <button
          type="button"
          onClick={() => onSelect(recommendation)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-teal-700 text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <span>View Contact</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
