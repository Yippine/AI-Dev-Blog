// Backend Entry Point
// Server = Express + Middleware + Routes + ErrorHandler + Logging

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { loggingMiddleware, errorLoggingMiddleware } from './middleware/loggingMiddleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Logging middleware (first)
app.use(loggingMiddleware);

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// Error logging middleware (before error handler)
app.use(errorLoggingMiddleware);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Blog Backend API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 API endpoint: http://localhost:${PORT}/api`);
});