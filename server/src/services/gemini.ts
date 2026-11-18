import { GoogleGenAI, Type } from '@google/genai';
import {
  RawAiTriageResult,
  SupportCategory,
} from '../types/support';

const VALID_CATEGORIES: SupportCategory[] = [
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

const SYSTEM_INSTRUCTION = `
You are Student Support Navigator, a university student support triage assistant.

Your job is to understand a student's description and identify which university support services may be relevant.

IMPORTANT TRIAGE RULES:

1. NEVER reject a meaningful student concern simply because it is short.

2. If a student mentions even a basic area of concern, classify it.

Examples:

"I need help in my studies"
-> academic

"I am struggling with exams"
-> academic

"I am stressed"
-> wellbeing

"I need financial help"
-> financial

"I need career guidance"
-> career

"I need help with an internship"
-> career

"I am having trouble with my roommate"
-> housing

"I am having trouble making friends"
-> student_life

"I feel lonely"
-> wellbeing and student_life

"I am struggling with exams and I feel stressed"
-> academic and wellbeing

"I am struggling with exams because I cannot focus and I am having trouble making friends"
-> academic, wellbeing, student_life

3. A message does NOT need to contain a specific university service name.

4. Understand natural language, incomplete sentences, speech-to-text errors, and conversational descriptions.

5. Do NOT require the student to explain their problem in detail before providing a relevant category.

6. Only return an empty recommendations array when the message is genuinely a greeting, test message, or contains no identifiable student concern.

Examples that may return empty recommendations:

"hello"
"hi"
"hey"
"test"

However:

"hi, I need help with my exams"
is NOT a greeting-only message and MUST be classified as academic.

"I need help"
may be unclear.

"I need help with studies"
is NOT unclear and MUST return academic.

"I don't know what to do with my studies"
is academic.

"I am not able to focus on my exams"
is academic and may also be wellbeing if emotional difficulty is mentioned.

Available support categories:

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

Choose up to 3 relevant categories.

For every recommendation return:

- category: exactly one category from the list
- relevance: "high", "medium", or "low"
- reason: a short supportive explanation

Use supportive language.

Do not diagnose medical or mental health conditions.

Do not make assumptions about the student's identity.

If the student describes multiple concerns, identify multiple relevant categories.

If the student describes an immediate safety concern or crisis, include urgent_support.

Do not generate phone numbers.

Do not generate service names.

Only return category names from the provided list.

Return JSON matching the requested schema.
`;

export async function triageWithGemini(
  studentMessage: string
): Promise<RawAiTriageResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    console.warn(
      '[Gemini Service] GEMINI_API_KEY is not configured. Using local fallback.'
    );

    return fallbackLocalTriage(studentMessage);
  }

  const ai = new GoogleGenAI({
    apiKey,
  });

  const modelName =
    process.env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';

  try {
    console.log(
      `[Gemini Service] Calling model: ${modelName}`
    );

    const response = await ai.models.generateContent({
      model: modelName,

      contents: `Student's description:

${studentMessage}`,

      config: {
        systemInstruction: SYSTEM_INSTRUCTION,

        temperature: 0.2,

        responseMimeType: 'application/json',

        responseJsonSchema: {
          type: Type.OBJECT,

          properties: {
            needs: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },

            recommendations: {
              type: Type.ARRAY,

              items: {
                type: Type.OBJECT,

                properties: {
                  category: {
                    type: Type.STRING,
                  },

                  relevance: {
                    type: Type.STRING,
                  },

                  reason: {
                    type: Type.STRING,
                  },
                },

                required: [
                  'category',
                  'relevance',
                  'reason',
                ],
              },
            },
          },

          required: [
            'needs',
            'recommendations',
          ],
        },
      },
    });

    const responseText = response.text?.trim();

    if (!responseText) {
      console.warn(
        '[Gemini Service] Gemini returned an empty response. Using local fallback.'
      );

      return fallbackLocalTriage(studentMessage);
    }

    const parsed = JSON.parse(
      responseText
    ) as RawAiTriageResult;

    const cleanedResult = cleanAiResult(parsed);

    /*
     * Safety net:
     * If Gemini gives an empty recommendation for a meaningful
     * message, use the local triage engine instead.
     */
    if (
      cleanedResult.recommendations.length === 0 &&
      isMeaningfulStudentMessage(studentMessage)
    ) {
      console.warn(
        '[Gemini Service] Gemini returned no recommendations for a meaningful message. Using local fallback.'
      );

      return fallbackLocalTriage(studentMessage);
    }

    return cleanedResult;

  } catch (error: any) {
    console.error(
      '[Gemini Service Error]:',
      error
    );

    /*
     * Gemini can temporarily return:
     *
     * 503 = model unavailable
     * 429 = quota/rate limit
     * 500 = temporary server error
     *
     * Use local triage so the application continues working.
     */
    if (
      error?.status === 503 ||
      error?.status === 429 ||
      error?.status === 500
    ) {
      console.warn(
        '[Gemini Service] Gemini temporarily unavailable. Switching to local fallback.'
      );

      return fallbackLocalTriage(studentMessage);
    }

    throw error;
  }
}

/**
 * Checks whether the student's message contains
 * a meaningful concern.
 */
function isMeaningfulStudentMessage(
  message: string
): boolean {
  const normalized = message
    .toLowerCase()
    .trim();

  if (!normalized) {
    return false;
  }

  const greetingOnly = [
    'hello',
    'hi',
    'hey',
    'test',
    'good morning',
    'good afternoon',
    'good evening',
  ];

  if (greetingOnly.includes(normalized)) {
    return false;
  }

  return true;
}

/**
 * Validates and cleans Gemini's response.
 */
function cleanAiResult(
  result: RawAiTriageResult
): RawAiTriageResult {
  if (
    !result ||
    !Array.isArray(result.recommendations)
  ) {
    return {
      needs: [],
      recommendations: [],
      responseType: 'triage',
      message: '',
    };
  }

  const validRecommendations =
    result.recommendations
      .filter((recommendation) => {
        if (!recommendation) {
          return false;
        }

        const category =
          recommendation.category
            ?.toLowerCase()
            .trim();

        return VALID_CATEGORIES.includes(
          category as SupportCategory
        );
      })
      .slice(0, 3)
      .map((recommendation) => {
        const category =
          recommendation.category
            .toLowerCase()
            .trim();

        let relevance:
          | 'high'
          | 'medium'
          | 'low' = 'medium';

        if (
          recommendation.relevance === 'high' ||
          recommendation.relevance === 'medium' ||
          recommendation.relevance === 'low'
        ) {
          relevance =
            recommendation.relevance;
        }

        return {
          category,
          relevance,
          reason:
            recommendation.reason?.trim() ||
            'Based on what you shared, this support service may be relevant.',
        };
      });

  return {
    needs: validRecommendations.map(
      (recommendation) => recommendation.category
    ),

    recommendations: validRecommendations,

    responseType: 'triage',

    message: '',
  };
}

/**
 * Local rule-based fallback.
 *
 * Used when:
 * - Gemini API key is missing
 * - Gemini returns 503
 * - Gemini returns 429
 * - Gemini returns 500
 * - Gemini returns an empty response
 * - Gemini gives no recommendation for a meaningful message
 */
function fallbackLocalTriage(
  message: string
): RawAiTriageResult {
  const normalized = message
    .toLowerCase()
    .trim();

  if (!normalized) {
    return {
      needs: [],
      recommendations: [],
      responseType: 'triage',
      message: '',
    };
  }

  const greetingOnly = [
    'hello',
    'hi',
    'hey',
    'test',
    'good morning',
    'good afternoon',
    'good evening',
  ];

  if (greetingOnly.includes(normalized)) {
    return {
      needs: [],
      recommendations: [],
      responseType: 'triage',
      message:
        'Tell us a little about what you need help with, such as academics, wellbeing, finances, housing, careers, or student life.',
    };
  }

  const recommendations: Array<{
    category: SupportCategory;
    relevance: 'high' | 'medium' | 'low';
    reason: string;
  }> = [];

  const addRecommendation = (
    category: SupportCategory,
    relevance: 'high' | 'medium' | 'low',
    reason: string
  ) => {
    if (
      !recommendations.some(
        (recommendation) =>
          recommendation.category === category
      )
    ) {
      recommendations.push({
        category,
        relevance,
        reason,
      });
    }
  };

  /*
   * URGENT SUPPORT
   */
  if (
    normalized.includes('suicid') ||
    normalized.includes('kill myself') ||
    normalized.includes('hurt myself') ||
    normalized.includes('harm myself') ||
    normalized.includes('self harm') ||
    normalized.includes('unsafe') ||
    normalized.includes('danger') ||
    normalized.includes('emergency') ||
    normalized.includes('crisis')
  ) {
    addRecommendation(
      'urgent_support',
      'high',
      'Based on what you shared, immediate support and safety assistance may be appropriate.'
    );
  }

  /*
   * ACADEMIC
   */
  if (
    normalized.includes('study') ||
    normalized.includes('studies') ||
    normalized.includes('studying') ||
    normalized.includes('exam') ||
    normalized.includes('exams') ||
    normalized.includes('test') ||
    normalized.includes('assignment') ||
    normalized.includes('coursework') ||
    normalized.includes('subject') ||
    normalized.includes('subjects') ||
    normalized.includes('class') ||
    normalized.includes('classes') ||
    normalized.includes('course') ||
    normalized.includes('courses') ||
    normalized.includes('grade') ||
    normalized.includes('grades') ||
    normalized.includes('marks') ||
    normalized.includes('academic') ||
    normalized.includes('semester') ||
    normalized.includes('professor') ||
    normalized.includes('lecturer') ||
    normalized.includes('teacher') ||
    normalized.includes('concentrat') ||
    normalized.includes('focus') ||
    normalized.includes('failing') ||
    normalized.includes('failed') ||
    normalized.includes('deadline') ||
    normalized.includes('backlog') ||
    normalized.includes('assignment')
  ) {
    addRecommendation(
      'academic',
      'high',
      'Based on what you shared, academic support may help you manage your studies, exams, coursework, or academic difficulties.'
    );
  }

  /*
   * WELLBEING
   */
  if (
    normalized.includes('stress') ||
    normalized.includes('stressed') ||
    normalized.includes('anxiety') ||
    normalized.includes('anxious') ||
    normalized.includes('overwhelmed') ||
    normalized.includes('overwhelm') ||
    normalized.includes('depress') ||
    normalized.includes('sad') ||
    normalized.includes('lonely') ||
    normalized.includes('loneliness') ||
    normalized.includes('emotion') ||
    normalized.includes('emotional') ||
    normalized.includes('cry') ||
    normalized.includes('crying') ||
    normalized.includes('burnout') ||
    normalized.includes('burned out') ||
    normalized.includes('mental') ||
    normalized.includes('cannot cope') ||
    normalized.includes("can't cope") ||
    normalized.includes('struggling') ||
    normalized.includes('worried') ||
    normalized.includes('worry') ||
    normalized.includes('pressure')
  ) {
    addRecommendation(
      'wellbeing',
      'high',
      'Based on what you shared, wellbeing support may help with stress, emotional pressure, or difficulty coping.'
    );
  }

  /*
   * STUDENT LIFE / FRIENDSHIPS
   */
  if (
    normalized.includes('friend') ||
    normalized.includes('friends') ||
    normalized.includes('friendship') ||
    normalized.includes('friendships') ||
    normalized.includes('social') ||
    normalized.includes('lonely') ||
    normalized.includes('alone') ||
    normalized.includes('making friends') ||
    normalized.includes('make friends') ||
    normalized.includes('campus life') ||
    normalized.includes('student life') ||
    normalized.includes('club') ||
    normalized.includes('society') ||
    normalized.includes('event') ||
    normalized.includes('connection') ||
    normalized.includes('social life')
  ) {
    addRecommendation(
      'student_life',
      'high',
      'Student life support may help with friendships, social connections, campus involvement, and feeling more connected to university life.'
    );
  }

  /*
   * FINANCIAL
   */
  if (
    normalized.includes('fee') ||
    normalized.includes('fees') ||
    normalized.includes('tuition') ||
    normalized.includes('money') ||
    normalized.includes('financial') ||
    normalized.includes('finance') ||
    normalized.includes('scholarship') ||
    normalized.includes('grant') ||
    normalized.includes('funding') ||
    normalized.includes('afford') ||
    normalized.includes('debt') ||
    normalized.includes('loan')
  ) {
    addRecommendation(
      'financial',
      'high',
      'You mentioned a financial concern, so financial aid or student funding support may be relevant.'
    );
  }

  /*
   * HOUSING
   */
  if (
    normalized.includes('hostel') ||
    normalized.includes('dorm') ||
    normalized.includes('housing') ||
    normalized.includes('accommodation') ||
    normalized.includes('roommate') ||
    normalized.includes('room mate') ||
    normalized.includes('rent') ||
    normalized.includes('landlord') ||
    normalized.includes('living arrangement')
  ) {
    addRecommendation(
      'housing',
      'high',
      'You mentioned a concern about accommodation or living arrangements, so housing support may be relevant.'
    );
  }

  /*
   * CAREER
   */
  if (
    normalized.includes('internship') ||
    normalized.includes('internships') ||
    normalized.includes('placement') ||
    normalized.includes('placements') ||
    normalized.includes('career') ||
    normalized.includes('resume') ||
    normalized.includes('cv') ||
    normalized.includes('job') ||
    normalized.includes('jobs') ||
    normalized.includes('interview') ||
    normalized.includes('interviews') ||
    normalized.includes('application') ||
    normalized.includes('applications') ||
    normalized.includes('employment') ||
    normalized.includes('company') ||
    normalized.includes('companies')
  ) {
    addRecommendation(
      'career',
      'high',
      'You mentioned a career or internship concern, so career guidance and placement support may be relevant.'
    );
  }

  /*
   * ACCESSIBILITY
   */
  if (
    normalized.includes('disability') ||
    normalized.includes('disabled') ||
    normalized.includes('accessibility') ||
    normalized.includes('wheelchair') ||
    normalized.includes('adhd') ||
    normalized.includes('learning difficulty') ||
    normalized.includes('learning support') ||
    normalized.includes('exam accommodation')
  ) {
    addRecommendation(
      'accessibility',
      'high',
      'Accessibility or learning support may be relevant based on what you described.'
    );
  }

  /*
   * GRIEVANCE
   */
  if (
    normalized.includes('complaint') ||
    normalized.includes('complaints') ||
    normalized.includes('harass') ||
    normalized.includes('bully') ||
    normalized.includes('bullying') ||
    normalized.includes('grievance') ||
    normalized.includes('unfair') ||
    normalized.includes('conflict') ||
    normalized.includes('discrimination') ||
    normalized.includes('misconduct')
  ) {
    addRecommendation(
      'grievance',
      'high',
      'You described a complaint, conflict, or potentially unfair situation that may require formal university support.'
    );
  }

  /*
   * INTERNATIONAL
   */
  if (
    normalized.includes('visa') ||
    normalized.includes('international') ||
    normalized.includes('immigration') ||
    normalized.includes('passport') ||
    normalized.includes('foreign student') ||
    normalized.includes('study abroad')
  ) {
    addRecommendation(
      'international',
      'high',
      'International student or immigration support may be relevant to your concern.'
    );
  }

  /*
   * HEALTH
   */
  if (
    normalized.includes('sick') ||
    normalized.includes('doctor') ||
    normalized.includes('injury') ||
    normalized.includes('illness') ||
    normalized.includes('physical health') ||
    normalized.includes('clinic') ||
    normalized.includes('fever') ||
    normalized.includes('pain') ||
    normalized.includes('medical')
  ) {
    addRecommendation(
      'health',
      'high',
      'You mentioned a physical health concern that may benefit from university health services.'
    );
  }

  /*
   * WELLNESS
   */
  if (
    normalized.includes('gym') ||
    normalized.includes('fitness') ||
    normalized.includes('recreation') ||
    normalized.includes('exercise') ||
    normalized.includes('sleep') ||
    normalized.includes('healthy routine') ||
    normalized.includes('wellness') ||
    normalized.includes('routine')
  ) {
    addRecommendation(
      'wellness',
      'medium',
      'General wellness or lifestyle support may be relevant to what you described.'
    );
  }

  /*
   * Generic support request
   */
  if (
    recommendations.length === 0 &&
    (
      normalized.includes('help') ||
      normalized.includes('support') ||
      normalized.includes('problem') ||
      normalized.includes('issue') ||
      normalized.includes('struggling') ||
      normalized.includes('difficult') ||
      normalized.includes('difficulty')
    )
  ) {
    addRecommendation(
      'student_life',
      'medium',
      'Student support services can help you identify the right university resource for your situation.'
    );
  }

  /*
   * Meaningful message with no recognized keyword.
   *
   * Instead of showing "more information required",
   * give the student a general student-support route.
   */
  if (
    recommendations.length === 0 &&
    normalized.length >= 8
  ) {
    addRecommendation(
      'student_life',
      'medium',
      'Based on what you shared, student support services may help identify the most appropriate resource for your situation.'
    );
  }

  /*
   * Remove duplicate categories.
   */
  const uniqueRecommendations =
    recommendations.filter(
      (recommendation, index, array) =>
        array.findIndex(
          (item) =>
            item.category ===
            recommendation.category
        ) === index
    );

  /*
   * Maximum 3 recommendations.
   */
  const trimmed =
    uniqueRecommendations.slice(0, 3);

  return {
    needs: trimmed.map(
      (recommendation) =>
        recommendation.category
    ),

    recommendations: trimmed,

    responseType: 'triage',

    message: '',
  };
}