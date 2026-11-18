"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const services_json_1 = __importDefault(require("../data/services.json"));
const gemini_1 = require("../services/gemini");
const router = (0, express_1.Router)();
const services = services_json_1.default;
// Map of category -> ServiceItem for fast, type-safe lookup
const serviceCategoryMap = new Map();
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
/**
 * POST /api/triage
 * Triages the student's natural language input, matches against services.json,
 * and returns structured service recommendations with verified contact information.
 */
router.post('/triage', async (req, res) => {
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
        const normalized = trimmed.toLowerCase();
        if (UNCLEAR_PHRASES.has(normalized) || trimmed.length < 5) {
            const responsePayload = {
                recommendations: [],
                unclearInput: true,
                message: "We'd like a little more information. Tell us a little more about what you're dealing with so we can point you toward the most relevant support.",
            };
            res.json(responsePayload);
            return;
        }
        // 4. Invoke Gemini AI Triage Service
        const aiResult = await (0, gemini_1.triageWithGemini)(trimmed);
        // 5. Validate and map against services.json
        // Only accept categories defined in services.json. Phone numbers MUST come from services.json.
        const recommendations = [];
        const seenCategories = new Set();
        for (const rec of aiResult.recommendations || []) {
            const category = rec.category?.toLowerCase();
            if (!category || seenCategories.has(category)) {
                continue;
            }
            const matchedService = serviceCategoryMap.get(category);
            if (matchedService) {
                seenCategories.add(category);
                recommendations.push({
                    service: matchedService.name,
                    category: matchedService.category,
                    relevance: rec.relevance === 'high' || rec.relevance === 'medium' || rec.relevance === 'low'
                        ? rec.relevance
                        : 'medium',
                    reason: rec.reason?.trim() ||
                        `Based on what you shared, the ${matchedService.name} team may be able to support you.`,
                    phone: matchedService.phone,
                    description: matchedService.description,
                });
            }
        }
        // 6. Handle empty recommendations (AI found no match or description was too vague)
        if (recommendations.length === 0) {
            const responsePayload = {
                recommendations: [],
                unclearInput: true,
                message: "We'd like a little more information. Tell us a little more about what you're dealing with so we can point you toward the most relevant support.",
            };
            res.json(responsePayload);
            return;
        }
        // 7. Check if urgent support is included
        const isUrgent = recommendations.some((r) => r.category === 'urgent_support');
        // Return structured triage payload
        const responsePayload = {
            recommendations,
            isUrgent,
            unclearInput: false,
        };
        res.json(responsePayload);
    }
    catch (error) {
        // Log technical error only to backend console as requested
        console.error('[Triage Controller Error]:', error);
        // Return friendly, non-technical error to the client
        res.status(503).json({
            error: "We couldn't process your request right now.",
            detail: "Please try again, or contact the university's general student support service.",
        });
    }
});
/**
 * GET /api/services
 * Returns the full directory of available fictional university support services.
 */
router.get('/services', (_req, res) => {
    res.json({ services });
});
exports.default = router;
