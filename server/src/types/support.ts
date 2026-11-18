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

export interface RawAiRecommendation {
  category: string;
  relevance: RelevanceLevel;
  reason: string;
}

export type AiResponseType =
  | 'triage'
  | 'conversation'
  | 'unclear';

export interface RawAiTriageResult {
  responseType: AiResponseType;
  needs: string[];
  recommendations: RawAiRecommendation[];
  message: string;
}
export interface TriageRecommendation {
  service: string;
  category: SupportCategory;
  relevance: RelevanceLevel;
  reason: string;
  phone: string;
  description: string;
}

export type TriageResponseType = 'triage' | 'conversation' | 'unclear';

export interface TriageResponse {
  recommendations: TriageRecommendation[];
  unclearInput?: boolean;
  isUrgent?: boolean;
  message?: string;
  inputType?: 'greeting' | 'vague' | 'normal';
  responseType?: TriageResponseType;
}

