import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { LandingHero } from '../components/LandingHero';
import { SupportInput } from '../components/SupportInput';
import { RecommendationCard } from '../components/RecommendationCard';
import { ContactCard } from '../components/ContactCard';
import { SupportJourney } from '../components/SupportJourney';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { UrgentNotice } from '../components/UrgentNotice';
import { ServiceDirectoryModal } from '../components/ServiceDirectoryModal';
import {
  ServiceItem,
  TriageRecommendation,
  TriageResponse,
  ViewScreen,
} from '../types/support';
import { triageMessage, fetchServices } from '../services/api';

interface HomeProps {
  currentView: ViewScreen;
  setCurrentView: (view: ViewScreen) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export const Home: React.FC<HomeProps> = ({
  currentView,
  setCurrentView,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [studentMessage, setStudentMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [triageResult, setTriageResult] = useState<TriageResponse | null>(null);
  const [selectedService, setSelectedService] = useState<TriageRecommendation | null>(null);
  const [errorType, setErrorType] = useState<'unclear' | 'api_error' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [directoryServices, setDirectoryServices] = useState<ServiceItem[]>([]);

  // Load directory services for the modal preview
  useEffect(() => {
    fetchServices()
      .then((data) => setDirectoryServices(data))
      .catch((err) => console.warn('Could not load service directory preview:', err));
  }, []);

  const handleStartTriage = () => {
    setCurrentView('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTriageSubmit = async (message: string) => {
    setStudentMessage(message);
    setIsLoading(true);
    setErrorType(null);

    try {
      const response = await triageMessage(message);

      if (response.unclearInput || !response.recommendations || response.recommendations.length === 0) {
        setErrorType('unclear');
        setErrorMessage(
          response.message ||
            "Tell us a little more about what you're dealing with so we can point you toward the most relevant support."
        );
        setCurrentView('input');
      } else {
        setTriageResult(response);
        setCurrentView('results');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error('Error during triage:', err);
      setErrorType('api_error');
      setErrorMessage("We couldn't process your request right now.");
      setCurrentView('input');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectRecommendation = (recommendation: TriageRecommendation) => {
    setSelectedService(recommendation);
    setCurrentView('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToRecommendations = () => {
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartOver = () => {
    setStudentMessage('');
    setTriageResult(null);
    setSelectedService(null);
    setErrorType(null);
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTryAgain = () => {
    setErrorType(null);
    setCurrentView('input');
  };

  return (
    <div className="py-6 sm:py-10">
      {/* SCREEN 1: LANDING / WELCOME */}
      {currentView === 'landing' && (
        <LandingHero onStart={handleStartTriage} />
      )}

      {/* SCREEN 2: STUDENT INPUT & LOADING / ERROR STATES */}
      {currentView === 'input' && (
        <div>
          {isLoading ? (
            <LoadingState />
          ) : errorType ? (
            <ErrorState
              type={errorType}
              message={errorMessage}
              onTryAgain={handleTryAgain}
              onOpenDirectory={() => setIsModalOpen(true)}
            />
          ) : (
            <SupportInput
              onSubmit={handleTriageSubmit}
              isLoading={isLoading}
              initialMessage={studentMessage}
            />
          )}
        </div>
      )}

      {/* SCREEN 3: TRIAGE RESULT */}
      {currentView === 'results' && triageResult && (
        <div className="max-w-3xl mx-auto animate-fade-in">
          {/* Header navigation back to edit */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentView('input')}
              className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Edit your description</span>
            </button>

            <button
              onClick={handleStartOver}
              className="inline-flex items-center space-x-1 text-xs sm:text-sm font-medium text-slate-500 hover:text-teal-700 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start over</span>
            </button>
          </div>

          {/* Urgent crisis alert banner if crisis is indicated */}
          {triageResult.isUrgent && (
            <UrgentNotice
              onDirectConnect={() => {
                const urgentRec = triageResult.recommendations.find(
                  (r) => r.category === 'urgent_support'
                );
                if (urgentRec) {
                  handleSelectRecommendation(urgentRec);
                }
              }}
            />
          )}

          {/* Result Title & Subheading */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Here’s what may help
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Based on what you shared, these university support services may be relevant.
            </p>
          </div>

          {/* Student Quote Summary */}
          {studentMessage && (
            <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200/80 mb-6 text-xs text-slate-600">
              <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px] block mb-1">
                Your description
              </span>
              <p className="italic text-slate-800 line-clamp-3">"{studentMessage}"</p>
            </div>
          )}

          {/* Recommendations Cards List */}
          <div className="space-y-4">
            {triageResult.recommendations.map((rec, index) => (
              <RecommendationCard
                key={`${rec.category}-${index}`}
                recommendation={rec}
                rank={index + 1}
                onSelect={handleSelectRecommendation}
              />
            ))}
          </div>

          {/* Support Journey */}
          <SupportJourney
            recommendations={triageResult.recommendations}
            studentMessage={studentMessage}
            onSelectService={handleSelectRecommendation}
          />
          {/* Footer note */}
          <div className="mt-8 p-4 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            <p>
              You can choose any of the options above to view direct contact
              details. You are not committed to any service.
            </p>
          </div>
        </div>
      )}

      {/* SCREEN 4: CONTACT / ROUTING */}
      {currentView === 'contact' && selectedService && (
        <ContactCard
          recommendation={selectedService}
          onBackToRecommendations={handleBackToRecommendations}
          onStartOver={handleStartOver}
        />
      )}

      {/* Service Directory Modal */}
      <ServiceDirectoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        services={directoryServices}
      />
    </div>
  );
};
