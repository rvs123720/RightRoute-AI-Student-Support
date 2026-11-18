import React from 'react';
import { X, PhoneCall } from 'lucide-react';
import { ServiceItem } from '../types/support';
import { getCategoryTheme } from '../utils/serviceIcons';

interface ServiceDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceItem[];
}

export const ServiceDirectoryModal: React.FC<ServiceDirectoryModalProps> = ({
  isOpen,
  onClose,
  services,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="directory-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 id="directory-title" className="text-xl font-bold text-slate-900">
              University Support Services Directory
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              All 12 example support services available for demonstration
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Close service directory modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {services.map((svc) => {
              const theme = getCategoryTheme(svc.category);
              const Icon = theme.icon;
              return (
                <div
                  key={svc.id}
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <div
                        className={`w-9 h-9 rounded-xl ${theme.iconBg} ${theme.iconColor} flex items-center justify-center shrink-0 border ${theme.borderColor}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-slate-900 leading-tight">
                          {svc.name}
                        </h3>
                        <span className="text-[10px] font-medium text-slate-500 capitalize">
                          {theme.label}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {svc.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      {svc.phone}
                    </span>
                    <a
                      href={`tel:${svc.phone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium transition-colors"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>Call</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Example university services shown for demonstration.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
