import { Router, Request, Response } from 'express';
import servicesData from '../data/services.json';
import { triageWithGemini } from '../services/gemini';
import {
  ServiceItem,
  SupportCategory,
  TriageRecommendation,
  TriageResponse,
} from '../types/support';

const router = Router();
const services: ServiceItem[] = servicesData as ServiceItem[];

// Map of category -> ServiceItem for fast, type-safe lookup
const serviceCategoryMap = new Map<SupportCategory, ServiceItem>();
services.forEach((service) => {
  serviceCategoryMap.set(service.category, service);
});

// Common vague phrases that lack actionable context
const UNCLEAR_PHRASES = new Set([
  'hello',
  'hi',
  'hey',
  'help',
  'i need help',
  'help me',
  'please help',
  'test',
  'support',
  'good morning',
  'good evening',
  'anyone there',
]);

// Separate sets for greetings and vague help requests
const GREETING_PHRASES = new Set([
  'hello',
  'hi',
  'hey',
  'good morning',
  'good afternoon',
  'good evening',
]);

const VAGUE_PHRASES = new Set([
  'i need help',
  'help',
  'help me',
  'please help',
  'support',
  'need support',
  'can you help me',
]);

/**
 * POST /api/triage
 * Triages the student's natural language input, matches against services.json,
 * and returns structured service recommendations with verified contact information.
 */
router.post('/triage', async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;

    // 1. Validate presence and type
    if (!message || typeof message !== 'string') {
      res.status(400).json({
        error: 'Invalid request: "message" field is required and must be a string.',
      });
      return;
    }

    const trimmed = message.trim();

    // 2. Validate content length
    if (trimmed.length === 0) {
      res.status(400).json({
        error: 'Please describe your concern so we can recommend the right service.',
      });
      return;
    }

    if (trimmed.length > 2000) {
      res.status(400).json({
        error: 'Message exceeds maximum length of 2000 characters.',
      });
      return;
    }

    // 3. Fast check for minimal/unclear input
    const normalized = trimmed.toLowerCase().trim();
    // Greeting handling
    if (GREETING_PHRASES.has(normalized)) {
      const responsePayload: TriageResponse = {
        recommendations: [],
        unclearInput: true,
        inputType: 'greeting',
        message:
          "I'm Student Support Navigator. Tell me a little about what you're dealing with — for example, studies, exams, finances, housing, career, wellbeing, or anything else you're concerned about.",
      };
      res.json(responsePayload);
      return;
    }

    // Vague request handling
    if (VAGUE_PHRASES.has(normalized)) {
      const responsePayload: TriageResponse = {
        recommendations: [],
        unclearInput: true,
        inputType: 'vague',
        message:
          "Of course. Tell me a little about what you're dealing with, such as studies, exams, finances, housing, career, wellbeing, or another university concern.",
      };
      res.json(responsePayload);
      return;
    }

    // Existing generic short input fallback
    if (trimmed.length < 5) {
      const responsePayload: TriageResponse = {
        recommendations: [],
        unclearInput: true,
        message:
          "We'd like a little more information. Tell us a little more about what you're dealing with so we can point you toward the most relevant support.",
      };
      res.json(responsePayload);
      return;
    }

    // 4. Invoke Gemini AI Triage Service
    const aiResult = await triageWithGemini(trimmed);

// 5. Validate and map against services.json with keyword filtering (Layer 2)
// Keyword lists per category to ensure recommendations are grounded in the student's message
const categoryKeywords: Record<SupportCategory, string[]> = {
  academic: ['exam', 'class', 'course', 'study', 'homework', 'grade', 'assignment', 'lecture'],
  wellbeing: ['stress', 'anxiety', 'depress', 'overwhelmed', 'wellbeing', 'sad', 'lonely', 'mental'],
  career: ['career', 'job', 'intern', 'resume', 'interview', 'employment'],
  financial: ['money', 'tuition', 'fees', 'financial', 'scholarship', 'loan', 'pay', 'cost'],
  housing: ['housing', 'accommodation', 'room', 'dorm', 'lease', 'rent'],
  international: ['visa', 'international', 'immigration', 'passport', 'study abroad'],
  accessibility: ['accessibility', 'disability', 'wheelchair', 'accommodations'],
  grievance: ['complaint', 'grievance', 'harassment', 'dispute', 'bias', 'misconduct'],
  health: ['health', 'medical', 'clinic', 'illness', 'sick', 'doctor', 'nurse'],
  wellness: ['wellness', 'fitness', 'nutrition', 'exercise'],
  student_life: ['student life', 'club', 'social', 'extracurricular', 'activity'],
  urgent_support: [], // always keep urgent recommendations
};

const loweredMessage = trimmed.toLowerCase();
const filteredRecs = (aiResult.recommendations || []).filter((rec) => {
  const cat = rec.category?.toLowerCase() as SupportCategory;
  if (!cat) return false;
  const keywords = categoryKeywords[cat] ?? [];
  // If no keywords defined for the category (e.g., urgent_support), keep it.
  if (keywords.length === 0) return true;
  return keywords.some((kw) => loweredMessage.includes(kw));
});

const recommendations: TriageRecommendation[] = [];
const seenCategories = new Set<string>();

for (const rec of filteredRecs) {
  const category = rec.category?.toLowerCase() as SupportCategory;
  if (!category || seenCategories.has(category)) {
    continue;
  }

  const matchedService = serviceCategoryMap.get(category);
  if (matchedService) {
    seenCategories.add(category);
    recommendations.push({
      service: matchedService.name,
      category: matchedService.category,
      relevance:
        rec.relevance === 'high' || rec.relevance === 'medium' || rec.relevance === 'low'
          ? rec.relevance
          : 'medium',
      reason:
        rec.reason?.trim() ||
        `Based on what you shared, the ${matchedService.name} team may be able to support you.`,
      phone: matchedService.phone,
      description: matchedService.description,
    });
  }
}

    // 6. Handle empty recommendations (AI found no match or description was too vague)
    if (recommendations.length === 0) {
      const responsePayload: TriageResponse = {
        recommendations: [],
        unclearInput: true,
        message:
          "We'd like a little more information. Tell us a little more about what you're dealing with so we can point you toward the most relevant support.",
      };
      res.json(responsePayload);
      return;
    }

    // 7. Check if urgent support is included
    const isUrgent = recommendations.some((r) => r.category === 'urgent_support');

    // Return structured triage payload
    const responsePayload: TriageResponse = {
      recommendations,
      isUrgent,
      unclearInput: false,
    };

    res.json(responsePayload);
  } catch (error: any) {
    // Log technical error only to backend console as requested
    console.error('[Triage Controller Error]:', error);

    // Return friendly, non-technical error to the client
    res.status(503).json({
      error: "We couldn't process your request right now.",
      detail:
        "Please try again, or contact the university's general student support service.",
    });
  }
});

/**
 * GET /api/services
 * Returns the full directory of available fictional university support services.
 */
router.get('/services', (_req: Request, res: Response) => {
  res.json({ services });
});

export default router;
