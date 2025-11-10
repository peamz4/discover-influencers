import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import logger from './lib/logger';
import { errorHandler, notFound } from './middleware/error';
import { helmetConfig, generalLimiter, authLimiter, apiLimiter } from './middleware/security';

// Import routes
import authRoutes from './routes/auth';
import influencerRoutes from './routes/influencers';
import userRoutes from './routes/users';
import categoryRoutes from './routes/categories';
import peopleRoutes from './routes/people';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Security middleware
app.use(helmetConfig);
app.use(generalLimiter);

// CORS and parsing middleware
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    message: 'Prime Influencer API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/influencers', apiLimiter, influencerRoutes);
app.use('/api/users', apiLimiter, userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/people', apiLimiter, peopleRoutes);

// API info route
app.get('/api', (req: Request, res: Response) => {
  res.json({
    name: 'Prime Influencer API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        refresh: 'POST /api/auth/refresh',
        me: 'GET /api/auth/me',
        logout: 'POST /api/auth/logout',
      },
      influencers: {
        list: 'GET /api/influencers',
        get: 'GET /api/influencers/:id',
        create: 'POST /api/influencers',
        update: 'PUT /api/influencers/:id',
        delete: 'DELETE /api/influencers/:id',
        stats: 'GET /api/influencers/analytics/stats',
      },
      users: {
        list: 'GET /api/users',
        get: 'GET /api/users/:id',
        update: 'PUT /api/users/:id',
        delete: 'DELETE /api/users/:id',
      },
      categories: {
        list: 'GET /api/categories',
        create: 'POST /api/categories',
      },
    },
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server (only if not in serverless environment)
if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
    logger.info(`⚡️[server]: API documentation at http://localhost:${port}/api`);
    logger.info(`⚡️[server]: Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

export default app;
