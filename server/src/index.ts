import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import triageRouter from './routes/triage';

// Load environment variables reliably from server/.env or root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', triageRouter);

// Basic health check
app.get('/api/health', (_req: Request, res: Response) => {
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
  console.log(
    ` Gemini API Key: ${
      process.env.GEMINI_API_KEY ? 'Configured (Active)' : 'Not Set (Using Local Triage Engine)'
    }`
  );
  console.log(` API Endpoint: http://localhost:${PORT}/api/triage`);
  console.log(`====================================================`);
});
