import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorHandler } from '../../src/middleware/error';

// Import routes
import authRoutes from '../../src/routes/auth';
import influencerRoutes from '../../src/routes/influencers';
import userRoutes from '../../src/routes/users';
import categoryRoutes from '../../src/routes/categories';

/**
 * Create Express app for testing
 * This mirrors the production app setup but without server listening
 */
export const createTestApp = (): Express => {
  const app = express();

  // Middleware
  app.use(cors({ credentials: true }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes (same as production)
  app.use('/api/auth', authRoutes);
  app.use('/api/influencers', influencerRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/categories', categoryRoutes);

  // Error handling
  app.use(errorHandler);

  return app;
};
