import React from 'react';
import {
  Heart,
  GraduationCap,
  Coins,
  Home,
  ShieldAlert,
  Accessibility,
  Briefcase,
  Globe,
  Users,
  Stethoscope,
  Activity,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { SupportCategory } from '../types/support';

export interface CategoryTheme {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
}

export const CATEGORY_THEMES: Record<SupportCategory, CategoryTheme> = {
  wellbeing: {
    icon: Heart,
    label: 'Wellbeing',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700 border-rose-200',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    borderColor: 'border-rose-100',
  },
  academic: {
    icon: GraduationCap,
    label: 'Academic',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700 border-blue-200',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-100',
  },
  financial: {
    icon: Coins,
    label: 'Financial',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    borderColor: 'border-emerald-100',
  },
  housing: {
    icon: Home,
    label: 'Housing',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700 border-amber-200',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-100',
  },
  grievance: {
    icon: ShieldAlert,
    label: 'Grievance',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700 border-purple-200',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-100',
  },
  accessibility: {
    icon: Accessibility,
    label: 'Accessibility',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700 border-indigo-200',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    borderColor: 'border-indigo-100',
  },
  career: {
    icon: Briefcase,
    label: 'Career',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-700 border-teal-200',
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    borderColor: 'border-teal-100',
  },
  international: {
    icon: Globe,
    label: 'International',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700 border-sky-200',
    iconBg: 'bg-sky-50',
    iconColor: 'text-sky-600',
    borderColor: 'border-sky-100',
  },
  student_life: {
    icon: Users,
    label: 'Student Life',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-700 border-violet-200',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    borderColor: 'border-violet-100',
  },
  health: {
    icon: Stethoscope,
    label: 'Health',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-700 border-red-200',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    borderColor: 'border-red-100',
  },
  wellness: {
    icon: Activity,
    label: 'Wellness & Recreation',
    badgeBg: 'bg-green-50',
    badgeText: 'text-green-700 border-green-200',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    borderColor: 'border-green-100',
  },
  urgent_support: {
    icon: AlertCircle,
    label: 'Urgent Support',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-800 border-red-300 font-semibold',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-700',
    borderColor: 'border-red-200',
  },
};

export function getCategoryTheme(category: SupportCategory): CategoryTheme {
  return (
    CATEGORY_THEMES[category] || {
      icon: HelpCircle,
      label: 'General Support',
      badgeBg: 'bg-slate-100',
      badgeText: 'text-slate-700 border-slate-200',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      borderColor: 'border-slate-200',
    }
  );
}
