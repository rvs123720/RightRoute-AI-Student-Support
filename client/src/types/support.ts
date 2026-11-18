export type SupportCategory =
  | 'wellbeing'
  | 'academic'
  | 'financial'
  | 'housing'
  | 'grievance'
  | 'accessibility'
  | 'career'
  | 'international'
  | 'student_life'
  | 'health'
  | 'wellness'
  | 'urgent_support';

export type RelevanceLevel = 'high' | 'medium' | 'low';

export interface ServiceItem {
  id: string;
  name: string;
  category: SupportCategory;
  description: string;
  phone: string;
}

export interface TriageRecommendation {
  service: string;
  category: SupportCategory;
  relevance: RelevanceLevel;
  reason: string;
  phone: string;
  description: string;
}

export interface TriageResponse {
  recommendations: TriageRecommendation[];
  unclearInput?: boolean;
  isUrgent?: boolean;
  message?: string;
  error?: string;
}

export type ViewScreen = 'landing' | 'input' | 'results' | 'contact';
