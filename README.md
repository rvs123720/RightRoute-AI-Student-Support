# Student Support Navigator

> **Track 1 — Student Triage & Routing Prototype**  
> *Help students reach the right university support service quickly without needing to understand complex university administrative divisions.*

---

## 1. Project Overview

**Student Support Navigator** is a university triage and routing application prototype built for **Track 1: Student Triage & Routing**. 

Students experiencing challenges during their university life often don't know which department to reach out to—especially when issues involve overlapping academic, emotional, or financial stresses. This application provides a calm, confidential, and intelligent interface where students simply describe their situation in their own natural words. 

Powered by **Google Gemini API** on the backend, the system understands the student's multi-faceted needs, identifies 1–3 relevant university support services, explains *why* each service may help using empathetic and non-diagnostic language, and provides a direct contact pathway (phone number and next steps) to connect with human university support staff.

### Core Workflow

```text
STUDENT DESCRIBES PROBLEM
           ↓
   AI UNDERSTANDS NEED
           ↓
SYSTEM IDENTIFIES RELEVANT SERVICE(S)
           ↓
  SYSTEM EXPLAINS WHY
           ↓
  STUDENT SELECTS SERVICE
           ↓
PHONE / CONTACT INFORMATION PROVIDED
```

> **Prototype Disclaimer:** *Example university services shown for demonstration.*

---

## 2. Features

- **Natural Language Intake:** Students describe their concerns in everyday language (up to 1,200 characters) without needing to choose a department beforehand.
- **Multi-Category AI Triage:** Identifies composite needs (e.g., simultaneous wellbeing, academic coursework, and financial aid concerns).
- **Non-Diagnostic Explanations:** Complies with strict university safety standards—the AI explains why a service may assist without providing clinical diagnoses or psychiatric labels.
- **Verified University Routing:** Service categories and phone numbers are matched strictly against a verified service directory (`services.json`), preventing hallucinated phone numbers or fictitious contact routes.
- **Safety & Urgent Support Prioritization:** Automatically surfaces emergency safety alerts and prioritizes the *Crisis & Immediate Support* team if immediate danger or distress is indicated.
- **Direct Phone Dialing:** One-click `tel:` integration for mobile and desktop calling, plus quick clipboard copying.
- **12 Fictional Example Services Directory:** Built-in modal directory for students to browse all support resources available across the campus.
- **Pre-Loaded Example Scenarios:** 3 quick-test buttons on the intake screen to immediately demo typical student inquiries.
- **Robust Error Handling:** Distinguishes between vague/unclear inputs (e.g., "hello") and API errors, providing clear, supportive next steps.

---

## 3. Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                 React Frontend (Vite)                   │
│  - Natural language intake with character counting      │
│  - Reassurance notes & zero-login architecture          │
│  - Dynamic recommendation cards & direct contact modal  │
└────────────────────────────┬────────────────────────────┘
                             │ HTTP POST /api/triage
                             ▼
┌─────────────────────────────────────────────────────────┐
│                  Express Backend (Node)                 │
│  - Input validation and length sanitation               │
│  - API key protection (never exposed to client)         │
│  - Structured JSON schema enforcement with Gemini SDK   │
│  - Category verification against services.json          │
└──────────────┬───────────────────────────┬──────────────┘
               │                           │
               ▼                           ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│    Google Gemini API    │     │      services.json      │
│  (gemini-2.5-flash)     │     │  (12 Example Services)  │
│  - Understands context  │     │  - Official phone lines │
│  - Suggests categories  │     │  - Accurate descriptions│
│  - Formulates reasons   │     │  - Ground truth contact │
└─────────────────────────┘     └─────────────────────────┘
```

---

## 4. Tech Stack

- **Frontend:**
  - React 18
  - Vite 6
  - TypeScript
  - Tailwind CSS
  - Lucide React (accessible, modern iconography)
- **Backend:**
  - Node.js (v18+)
  - Express
  - TypeScript & `tsx`
  - `@google/genai` (Official current Google Gen AI SDK)
  - `cors`, `dotenv`
- **Data:**
  - Local `services.json` directory containing 12 fictional university services (modular for future MongoDB or ServiceNow migration).

---

## 5. Folder Structure

```text
student-support-navigator/
├── client/
│   ├── public/
│   │   └── compass.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── ContactCard.tsx           # Screen 4: Phone & direct connection
│   │   │   ├── ErrorState.tsx            # Unclear input & API error screens
│   │   │   ├── Header.tsx                # University navigation & reset
│   │   │   ├── LandingHero.tsx           # Screen 1: Welcome & Find Support CTA
│   │   │   ├── LoadingState.tsx          # Calm loading indicator
│   │   │   ├── RecommendationCard.tsx    # Screen 3: Service recommendation cards
│   │   │   ├── ServiceDirectoryModal.tsx # Full 12 services directory modal
│   │   │   ├── SupportInput.tsx          # Screen 2: Textarea & example prompts
│   │   │   └── UrgentNotice.tsx          # Safety & crisis alert banner
│   │   ├── pages/
│   │   │   └── Home.tsx                  # Main screen state orchestrator
│   │   ├── services/
│   │   │   └── api.ts                    # Backend API client
│   │   ├── types/
│   │   │   └── support.ts                # Frontend TypeScript definitions
│   │   ├── utils/
│   │   │   └── serviceIcons.tsx          # Category-to-icon & color theme mapper
│   │   ├── App.tsx                       # App layout and disclaimer footer
│   │   ├── index.css                     # Tailwind directives and accessible focus
│   │   └── main.tsx                      # Vite React entry point
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts                    # Vite dev config with /api proxy
│
├── server/
│   ├── src/
│   │   ├── data/
│   │   │   └── services.json             # 12 verified example university services
│   │   ├── routes/
│   │   │   └── triage.ts                 # /api/triage and /api/services routes
│   │   ├── services/
│   │   │   └── gemini.ts                 # Gemini API client with fallback engine
│   │   ├── types/
│   │   │   └── support.ts                # Server TypeScript definitions
│   │   └── index.ts                      # Express server entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── .env.example                          # Root environment template
├── .gitignore
├── package.json                          # Root runner with concurrent scripts
└── README.md
```

---

## 6. The 12 Example University Support Services

The prototype includes 12 example university support services in `server/src/data/services.json`:

| # | Service Name | Category | Direct Phone Line |
|---|---|---|---|
| 1 | **Counselling & Mental Wellbeing** | `wellbeing` | `+91 98765 43201` |
| 2 | **Academic Support** | `academic` | `+91 98765 43202` |
| 3 | **Financial Aid** | `financial` | `+91 98765 43203` |
| 4 | **Accommodation & Housing** | `housing` | `+91 98765 43204` |
| 5 | **Student Grievance & Support** | `grievance` | `+91 98765 43205` |
| 6 | **Accessibility & Disability Services** | `accessibility` | `+91 98765 43206` |
| 7 | **Career Services** | `career` | `+91 98765 43207` |
| 8 | **International Student Services** | `international` | `+91 98765 43208` |
| 9 | **Student Affairs & Student Life** | `student_life` | `+91 98765 43209` |
| 10 | **Health Services** | `health` | `+91 98765 43210` |
| 11 | **Wellness & Recreation** | `wellness` | `+91 98765 43211` |
| 12 | **Crisis & Immediate Support** | `urgent_support` | `+91 98765 43212` |

---

## 7. How to Install and Set Up

### Prerequisites
- **Node.js** (v18 or higher recommended; tested on v24)
- **npm** (v9 or higher)

### Step 1: Clone or Navigate to the Project Folder
```bash
cd student-support-navigator
```

### Step 2: Install All Dependencies
Install dependencies for root, server, and client in one step:
```bash
npm run install:all
```
*(Or install manually in each folder: `npm install`, `cd server && npm install`, `cd ../client && npm install`)*

---

## 8. How to Configure the Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/) and create a free Gemini API key.
2. Open the file `server/.env` (or copy `server/.env.example` to `server/.env`).
3. Set your key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
GEMINI_MODEL=gemini-2.5-flash
```

> **Security Guarantee:**
> - `GEMINI_API_KEY` is loaded **only** on the Node/Express backend.
> - The key is **never** bundled or exposed to the Vite/React frontend.
> - `server/.env` is included in `.gitignore`.
> - If `GEMINI_API_KEY` is omitted, the application uses an internal rule-based triage fallback so the complete UI flow can still be tested locally.

---

## 9. How to Run the Application

### Option A: Run Both Frontend and Backend Concurrently (Recommended)
From the project root folder:
```bash
npm run dev
```
This runs:
- **Backend API:** `http://localhost:5000`
- **Frontend App:** `http://localhost:3000`

### Option B: Run Backend and Frontend in Separate Terminals

**Terminal 1 (Backend):**
```bash
npm run dev:server
# Server starts at http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
npm run dev:client
# Vite client starts at http://localhost:3000
```

Open your browser to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 10. Example Student Inputs for Demonstrations

### Example 1: Multi-Need Inquiry (Exams, Assignments & Fees)
> *"I'm really stressed about exams, I'm struggling with assignments and I'm also worried about my tuition fees."*

- **AI Needs Identified:** `wellbeing`, `academic`, `financial`
- **Recommended Services:**
  1. *Counselling & Mental Wellbeing* (High Relevance) — `+91 98765 43201`
  2. *Academic Support* (Medium/High Relevance) — `+91 98765 43202`
  3. *Financial Aid* (Medium Relevance) — `+91 98765 43203`
- **Outcome:** The student can independently select any service to view the direct contact number.

### Example 2: Financial Aid
> *"I'm worried about paying my tuition fees and I don't know what financial help is available."*

- **Recommended Service:** *Financial Aid* (`+91 98765 43203`)

### Example 3: Career Planning & Placements
> *"I'm looking for internships and I need help preparing for placements."*

- **Recommended Service:** *Career Services* (`+91 98765 43207`)

### Example 4: Unclear or Vague Input
> *"hello"* or *"I need help"*

- **Outcome:** System does **not** hallucinate random departments. Instead, it displays:  
  *"We'd like a little more information. Tell us a little more about what you're dealing with so we can point you toward the most relevant support."*

### Example 5: Urgent Safety Concern
> *"I'm in severe crisis and feel completely unsafe right now."*

- **Outcome:** Immediately displays the prominent red Emergency Banner with 24/7 crisis numbers and routes to *Crisis & Immediate Support* (`+91 98765 43212`).

---

## 11. API Specifications

### `POST /api/triage`

**Request:**
```json
{
  "message": "I've been feeling overwhelmed by exams and struggling with my coursework."
}
```

**Response (200 OK):**
```json
{
  "recommendations": [
    {
      "service": "Counselling & Mental Wellbeing",
      "category": "wellbeing",
      "relevance": "high",
      "reason": "Based on what you shared regarding feeling overwhelmed and exam stress.",
      "phone": "+91 98765 43201",
      "description": "Support for stress, anxiety, emotional difficulties, exam pressure and general mental wellbeing concerns."
    },
    {
      "service": "Academic Support",
      "category": "academic",
      "relevance": "medium",
      "reason": "You mentioned difficulty keeping up with coursework and study demands.",
      "phone": "+91 98765 43202",
      "description": "Support for coursework difficulties, study problems, exam preparation and academic challenges."
    }
  ],
  "isUrgent": false,
  "unclearInput": false
}
```

### `GET /api/services`
Returns all 12 example university support services.

### `GET /api/health`
Returns backend health status and indicates whether Gemini API Key is configured.

---

## 12. Safety Boundaries & Ethical AI Principles

1. **No Medical Diagnoses:** The model's system prompt strictly prohibits diagnosing clinical depression, anxiety disorders, psychiatric conditions, or suicidal ideation.
2. **Supportive, Non-Prescriptive Language:** Recommendations use phrasing such as *"may benefit from"*, *"appears relevant"*, and *"based on what you've shared"*.
3. **No Hallucinated Contact Information:** Gemini is **never** permitted to generate phone numbers. All contact details are dynamically mapped on the server from `services.json`.
4. **Invalid Category Filtering:** Any category suggested by AI that is not an exact match in `services.json` is stripped before sending to the client.
5. **No Data Harvesting:** The application requires no login, saves no cookies, and logs no student identity records.

---

## 13. ServiceNow-Aligned Concept & Future Extensibility

While this prototype deliberately excludes heavy database dependencies or direct ServiceNow integration to stay lightweight and focused on Track 1, its architecture is built for clean enterprise adoption:

1. **Service Directory Abstraction:** `services.json` can be swapped for a ServiceNow Service Catalog API (`sn_sc_category` / `sys_user_group`) or MongoDB without modifying the frontend.
2. **Interaction Logging & Case Creation:** When a student clicks "Call Service", a ServiceNow Incident or Case (`sn_customerservice_case`) can be automatically generated with triage tags.
3. **Multilingual Support:** Gemini's multilingual capabilities can automatically triage student requests submitted in any language while routing to local university resources.
4. **Accessible Communication Channels:** Can be expanded to include WhatsApp business lines, live chat links, or campus walk-in location maps.


⚠️ Disclaimer

RightRoute AI is a student support triage and routing prototype. The included university services and contact details are fictional examples intended for demonstration. The application does not replace professional counselling, medical assistance, or official university support channels.

👩‍💻 Developed By

RV Srujana
Computer Science and Engineering
Vasavi College of Engineering

Project: RightRoute AI – Student Support Navigator
