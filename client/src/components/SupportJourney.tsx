import React from 'react';
import {
  BookOpen,
  Briefcase,
  Heart,
  DollarSign,
  Home,
  Phone,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { TriageRecommendation } from '../types/support';

interface SupportJourneyProps {
  recommendations: TriageRecommendation[];
  studentMessage: string;
  onSelectService: (rec: TriageRecommendation) => void;
}

// Helper to generate steps based on category
const getSteps = (rec: TriageRecommendation) => {
  const baseSteps = [
    {
      title: 'Understand your concern',
      description: `Based on what you shared, ${rec.service} may be relevant.`,
      icon: <BookOpen className="w-5 h-5 text-teal-600" />,
    },
    {
      title: 'Choose your support service',
      description: `Review the recommended service and decide if it matches what you need.`,
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />,
    },
    {
      title: 'Contact the service',
      description: `Use the provided contact option to reach ${rec.service}.`,
      icon: <Phone className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Explain your situation',
      description: `Briefly explain what you are experiencing. You can start with the description you entered.`,
      icon: <AlertCircle className="w-5 h-5 text-teal-600" />,
    },
    {
      title: 'Get guidance',
      description: `The support team can explain the available options and guide you on next steps.`,
      icon: <ArrowRight className="w-5 h-5 text-teal-600" />,
    },
    {
      title: 'Follow up if needed',
      description: `If your concern involves multiple areas, you can also approach the other recommended services.`,
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />,
    },
  ];

  // Override for urgent support
  if (rec.category === 'urgent_support') {
    return [
      {
        title: 'Get immediate support',
        description:
          "Your description may indicate that immediate support could be appropriate.",
        icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      },
      {
        title: 'Contact Crisis & Immediate Support',
        description: 'Use the provided emergency/contact option immediately.',
        icon: <Phone className="w-5 h-5 text-red-600" />,
      },
      {
        title: 'Explain that you need urgent assistance',
        description: 'You do not need to figure everything out before contacting the service.',
        icon: <Briefcase className="w-5 h-5 text-red-600" />,
      },
    ];
  }

// Detailed category‑specific step definitions
const categorySteps: Record<string, typeof baseSteps> = {
  academic: [
    {
      title: 'Understand your concern',
      description: 'Academic Support can help you with study strategies, exam preparation, and course planning.',
      icon: <BookOpen className="w-5 h-5 text-teal-600" />, // reuse icon
    },
    {
      title: 'Choose your support service',
      description: 'Review the Academic Support options and select the one that fits your need.',
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Contact the service',
      description: 'Use the provided contact details to reach the Academic Support team.',
      icon: <Phone className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Explain your situation',
      description: 'Share the details you entered, letting them know about your academic challenge.',
      icon: <AlertCircle className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Get guidance',
      description: 'The team will suggest resources, tutoring, or study plan adjustments.',
      icon: <ArrowRight className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Follow up if needed',
      description: 'If your concern spans multiple areas, you can also explore other recommended services.',
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />, 
    },
  ],
  career: [
    {
      title: 'Understand your concern',
      description: 'Career Services can assist with job searching, internship placement, and professional development.',
      icon: <Briefcase className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Choose your support service',
      description: 'Select the Career Service that aligns with your goals.',
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Contact the service',
      description: 'Reach out via the contact information provided.',
      icon: <Phone className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Explain your situation',
      description: 'Describe your career aspirations and any obstacles you face.',
      icon: <AlertCircle className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Get guidance',
      description: 'Receive advice on resumes, interviews, networking, and job search strategies.',
      icon: <ArrowRight className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Follow up if needed',
      description: 'You may also explore other services like Academic Support for skill building.',
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />, 
    },
  ],
  wellbeing: [
    {
      title: 'Understand your concern',
      description: 'Wellbeing services offer counselling, mental health resources, and stress management.',
      icon: <Heart className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Choose your support service',
      description: 'Pick the counselling option that suits your needs.',
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Contact the service',
      description: 'Use the provided phone or booking link to schedule a session.',
      icon: <Phone className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Explain your situation',
      description: 'Talk about what you are experiencing and what you hope to achieve.',
      icon: <AlertCircle className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Get guidance',
      description: 'Therapists will suggest coping strategies, resources, and follow‑up plans.',
      icon: <ArrowRight className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Follow up if needed',
      description: 'Consider additional services like Academic or Career support as part of overall wellbeing.',
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />, 
    },
  ],
  financial: [
    {
      title: 'Understand your concern',
      description: 'Financial Aid can help with scholarships, bursaries, and budgeting advice.',
      icon: <DollarSign className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Choose your support service',
      description: 'Identify the specific financial assistance that matches your need.',
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Contact the service',
      description: 'Reach out via the contact details provided for the financial office.',
      icon: <Phone className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Explain your situation',
      description: 'Share details about your financial challenge and any relevant documents.',
      icon: <AlertCircle className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Get guidance',
      description: 'Advisors will outline options, application steps, and eligibility criteria.',
      icon: <ArrowRight className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Follow up if needed',
      description: 'You may also consult other services if your issue spans multiple areas.',
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />, 
    },
  ],
  housing: [
    {
      title: 'Understand your concern',
      description: 'Accommodation services can assist with on‑campus housing, off‑campus options, and lease issues.',
      icon: <Home className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Choose your support service',
      description: 'Select the housing service that addresses your specific need.',
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Contact the service',
      description: 'Use the contact details to get in touch with the housing office.',
      icon: <Phone className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Explain your situation',
      description: 'Provide information about your housing problem or request.',
      icon: <AlertCircle className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Get guidance',
      description: 'Staff will advise on available rooms, applications, or dispute resolution.',
      icon: <ArrowRight className="w-5 h-5 text-teal-600" />, 
    },
    {
      title: 'Follow up if needed',
      description: 'If other concerns arise, you can also explore additional recommended services.',
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />, 
    },
  ],
};

if (categorySteps[rec.category]) {
  return categorySteps[rec.category];
}

// Default generic steps (already defined in baseSteps)
return baseSteps;
};

export const SupportJourney: React.FC<SupportJourneyProps> = ({
  recommendations,
  studentMessage,
  onSelectService,
}) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-slate-900">Your Support Journey</h2>
      {recommendations.map((rec, idx) => {
        const steps = getSteps(rec);
        return (
          <div key={rec.category + idx} className="mb-6 border-l-2 border-teal-200 pl-4">
            <h3 className="text-lg font-medium text-slate-800 mb-2">
              {rec.service}
            </h3>
            <ol className="space-y-4">
              {steps.map((step, sIdx) => (
                <li key={sIdx} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">{step.icon}</div>
                  <div>
                    <p className="font-medium text-slate-700">{`STEP ${sIdx + 1} — ${step.title}`}</p>
                    <p className="text-sm text-slate-600">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            {/* CTA button to contact this service */}
            <button
              onClick={() => onSelectService(rec)}
              className="mt-3 inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Contact {rec.service}
            </button>
          </div>
        );
      })}
    </div>
  );
};
