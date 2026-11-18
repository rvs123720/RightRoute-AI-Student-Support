import React, { useState } from 'react';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { ViewScreen } from './types/support';
import { Info } from 'lucide-react';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewScreen>('landing');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleReset = () => {
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {/* Top Navigation */}
      <Header
        currentView={currentView}
        onReset={handleReset}
        onOpenDirectory={() => setIsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6">
        <Home
          currentView={currentView}
          setCurrentView={setCurrentView}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </main>

      {/* Standardized University / Prototype Footer */}
      <footer className="mt-auto border-t border-slate-200/90 bg-white py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2 text-center sm:text-left">
            <Info className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="font-medium text-slate-700">
              Example university services shown for demonstration.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-400">
            <span>Student Support Navigator</span>
            <span>•</span>
            <span>Track 1: Student Triage & Routing</span>
            <span>•</span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-teal-700 hover:underline font-medium"
            >
              12 University Services Directory
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
