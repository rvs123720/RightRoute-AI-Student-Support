"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.triageWithGemini = triageWithGemini;
const genai_1 = require("@google/genai");
const VALID_CATEGORIES = [
    'wellbeing',
    'academic',
    'financial',
    'housing',
    'grievance',
    'accessibility',
    'career',
    'international',
    'student_life',
    'health',
    'wellness',
    'urgent_support',
];
const SYSTEM_INSTRUCTION = `You are a student support triage assistant for a university.

Your job is to understand what kind of university support a student may need based only on the student's description.

You are NOT a medical professional.
You do NOT diagnose mental health conditions.
You do NOT determine whether a student has a disorder.
You only identify potentially relevant university support categories.

Available categories are:
wellbeing
academic
financial
housing
grievance
accessibility
career
international
student_life
health
wellness
urgent_support

Return valid JSON only matching the schema.

Choose up to 3 relevant categories.

For each category provide:
- category: one of the available category names exactly
- relevance: "high", "medium", or "low"
- reason: a short, supportive, non-diagnostic explanation (e.g. "You mentioned significant exam-related stress and difficulty concentrating.")

Guidelines for reasons:
- Use wording such as "may benefit from", "appears relevant", "based on what you've shared", "you may want to contact".
- Avoid definitive medical language or psychiatric labels (do NOT say "you have depression", "clinical anxiety", "bipolar", etc.).
- If the student's description is too brief, vague, or does not clearly match any service (such as "hello", "I need help", "hi", "test"), return an empty recommendations array.
- If the student describes a potentially urgent safety situation or immediate crisis, include "urgent_support" as a relevant category with high relevance and careful, non-diagnostic wording.
- Do not invent services.
- Do not invent phone numbers.
- Do not make assumptions about the student's personal identity.`;
/**
 * Perform triage via Google Gemini API using structured JSON output.
 */
async function triageWithGemini(studentMessage) {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
    if (!apiKey) {
        console.warn('[Gemini Service] No GEMINI_API_KEY detected in environment. Using fallback local triage analyzer.');
        return fallbackLocalTriage(studentMessage);
    }
    const ai = new genai_1.GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
        model: modelName,
        contents: `Student's description: "${studentMessage}"`,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseJsonSchema: {
                type: genai_1.Type.OBJECT,
                properties: {
                    needs: {
                        type: genai_1.Type.ARRAY,
                        items: { type: genai_1.Type.STRING },
                        description: 'List of relevant support category names',
                    },
                    recommendations: {
                        type: genai_1.Type.ARRAY,
                        items: {
                            type: genai_1.Type.OBJECT,
                            properties: {
                                category: {
                                    type: genai_1.Type.STRING,
                                    description: 'Category name from available list',
                                },
                                relevance: {
                                    type: genai_1.Type.STRING,
                                    description: 'Relevance rating: high, medium, or low',
                                },
                                reason: {
                                    type: genai_1.Type.STRING,
                                    description: 'Empathetic, non-diagnostic explanation of why this service may help',
                                },
                            },
                            required: ['category', 'relevance', 'reason'],
                        },
                        description: 'Up to 3 recommended support services',
                    },
                },
                required: ['needs', 'recommendations'],
            },
        },
    });
    const responseText = response.text;
    if (!responseText) {
        throw new Error('Empty response received from Gemini model.');
    }
    const parsed = JSON.parse(responseText);
    return parsed;
}
/**
 * Intelligent local fallback analyzer used if GEMINI_API_KEY is not yet configured,
 * ensuring seamless local exploration without breaking prototype evaluation.
 */
function fallbackLocalTriage(message) {
    const normalized = message.toLowerCase().trim();
    // Handle vague or greeting inputs
    const vagueInputs = [
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
        'good afternoon',
    ];
    if (vagueInputs.includes(normalized) || normalized.length < 8) {
        return { needs: [], recommendations: [] };
    }
    const recommendations = [];
    // Urgent / Safety keywords
    if (normalized.includes('emergency') ||
        normalized.includes('harm') ||
        normalized.includes('crisis') ||
        normalized.includes('suicid') ||
        normalized.includes('danger') ||
        normalized.includes('unsafe')) {
        recommendations.push({
            category: 'urgent_support',
            relevance: 'high',
            reason: 'Your message indicates that immediate support and safety assistance may be appropriate.',
        });
    }
    // Wellbeing keywords
    if (normalized.includes('stress') ||
        normalized.includes('anxiety') ||
        normalized.includes('anxious') ||
        normalized.includes('overwhelm') ||
        normalized.includes('concentrat') ||
        normalized.includes('depress') ||
        normalized.includes('emotional') ||
        normalized.includes('crying') ||
        normalized.includes('burnout') ||
        normalized.includes('lonely')) {
        recommendations.push({
            category: 'wellbeing',
            relevance: 'high',
            reason: 'Based on what you shared regarding stress, emotional pressure, and difficulty focusing.',
        });
    }
    // Academic keywords
    if (normalized.includes('exam') ||
        normalized.includes('assignment') ||
        normalized.includes('coursework') ||
        normalized.includes('study') ||
        normalized.includes('grade') ||
        normalized.includes('failing') ||
        normalized.includes('deadline') ||
        normalized.includes('class') ||
        normalized.includes('professor') ||
        normalized.includes('lecturer')) {
        recommendations.push({
            category: 'academic',
            relevance: recommendations.length === 0 ? 'high' : 'medium',
            reason: 'You mentioned coursework, study concerns, or exam preparation challenges.',
        });
    }
    // Financial keywords
    if (normalized.includes('fee') ||
        normalized.includes('tuition') ||
        normalized.includes('money') ||
        normalized.includes('financial') ||
        normalized.includes('scholarship') ||
        normalized.includes('grant') ||
        normalized.includes('funding') ||
        normalized.includes('afford') ||
        normalized.includes('debt')) {
        recommendations.push({
            category: 'financial',
            relevance: recommendations.length === 0 ? 'high' : 'medium',
            reason: 'You indicated concerns related to tuition fees, funding, or financial circumstances.',
        });
    }
    // Housing keywords
    if (normalized.includes('hostel') ||
        normalized.includes('dorm') ||
        normalized.includes('housing') ||
        normalized.includes('accommodation') ||
        normalized.includes('roommate') ||
        normalized.includes('rent') ||
        normalized.includes('landlord')) {
        recommendations.push({
            category: 'housing',
            relevance: 'high',
            reason: 'You shared concerns related to living arrangements, accommodation, or housing.',
        });
    }
    // Career keywords
    if (normalized.includes('internship') ||
        normalized.includes('placement') ||
        normalized.includes('career') ||
        normalized.includes('resume') ||
        normalized.includes('cv') ||
        normalized.includes('job') ||
        normalized.includes('interview')) {
        recommendations.push({
            category: 'career',
            relevance: 'high',
            reason: 'You mentioned exploring internships, placements, or future career planning.',
        });
    }
    // Accessibility / Disability
    if (normalized.includes('disability') ||
        normalized.includes('accessibility') ||
        normalized.includes('wheelchair') ||
        normalized.includes('adhd') ||
        normalized.includes('accommodation for exam') ||
        normalized.includes('learning support')) {
        recommendations.push({
            category: 'accessibility',
            relevance: 'high',
            reason: 'You noted accessibility needs or disability-related support requirements.',
        });
    }
    // Grievance
    if (normalized.includes('complaint') ||
        normalized.includes('harass') ||
        normalized.includes('bully') ||
        normalized.includes('grievance') ||
        normalized.includes('unfair') ||
        normalized.includes('conflict')) {
        recommendations.push({
            category: 'grievance',
            relevance: 'high',
            reason: 'You expressed a conflict, complaint, or grievance requiring formal student support.',
        });
    }
    // International
    if (normalized.includes('visa') ||
        normalized.includes('international') ||
        normalized.includes('immigrat') ||
        normalized.includes('passport') ||
        normalized.includes('foreign')) {
        recommendations.push({
            category: 'international',
            relevance: 'high',
            reason: 'You shared questions regarding international student documentation or adjustment.',
        });
    }
    // Health
    if (normalized.includes('sick') ||
        normalized.includes('doctor') ||
        normalized.includes('injury') ||
        normalized.includes('illness') ||
        normalized.includes('physical health') ||
        normalized.includes('clinic') ||
        normalized.includes('fever')) {
        recommendations.push({
            category: 'health',
            relevance: 'high',
            reason: 'You mentioned physical health symptoms or needing university health clinic access.',
        });
    }
    // Wellness
    if (normalized.includes('gym') ||
        normalized.includes('fitness') ||
        normalized.includes('recreation') ||
        normalized.includes('routine') ||
        normalized.includes('exercise') ||
        normalized.includes('sleep')) {
        recommendations.push({
            category: 'wellness',
            relevance: 'medium',
            reason: 'You mentioned healthy lifestyle habits, recreation, or wellbeing routines.',
        });
    }
    // Student life
    if (normalized.includes('club') ||
        normalized.includes('society') ||
        normalized.includes('campus life') ||
        normalized.includes('event')) {
        recommendations.push({
            category: 'student_life',
            relevance: 'medium',
            reason: 'You asked about campus engagement, societies, or general university student life.',
        });
    }
    // Limit to top 3 recommendations
    const trimmed = recommendations.slice(0, 3);
    return {
        needs: trimmed.map((r) => r.category),
        recommendations: trimmed,
    };
}
