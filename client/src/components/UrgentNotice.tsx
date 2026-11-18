import React from 'react';
import { AlertTriangle, PhoneCall } from 'lucide-react';

interface UrgentNoticeProps {
  onDirectConnect?: () => void;
}

export const UrgentNotice: React.FC<UrgentNoticeProps> = ({ onDirectConnect }) => {
  return (
    <div
      role="alert"
      className="p-5 rounded-2xl bg-red-50 border-2 border-red-200 text-slate-900 mb-8 shadow-xs animate-fade-in"
    >
      <div className="flex items-start space-x-3.5">
        <div className="p-2 rounded-xl bg-red-100 text-red-700 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-red-900 mb-1">
            Immediate Support Notice
          </h2>
          <p className="text-sm text-red-800 leading-relaxed mb-3">
            If you believe you are in immediate danger or need urgent help,
            contact your local emergency service or an appropriate crisis service immediately.
          </p>
          <p className="text-xs text-red-700/90 leading-relaxed mb-4">
            Your message may indicate that urgent support could be appropriate.
            University crisis staff are available for immediate assistance.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:+919876543212"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Crisis & Immediate Support: +91 98765 43212</span>
            </a>

            {onDirectConnect && (
              <button
                type="button"
                onClick={onDirectConnect}
                className="text-xs font-semibold text-red-800 hover:underline px-2 py-1"
              >
                View Service Details
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
