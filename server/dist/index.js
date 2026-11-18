"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const triage_1 = __importDefault(require("./routes/triage"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api', triage_1.default);
// Basic health check
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'Student Support Navigator API',
        geminiConfigured: !!process.env.GEMINI_API_KEY,
        timestamp: new Date().toISOString(),
    });
});
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Student Support Navigator Backend Server Running`);
    console.log(` Port: ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Configured (Active)' : 'Not Set (Using Local Triage Engine)'}`);
    console.log(` API Endpoint: http://localhost:${PORT}/api/triage`);
    console.log(`====================================================`);
});
