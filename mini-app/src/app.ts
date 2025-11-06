import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import patientRoutes from './routes/patients';
import noteRoutes from './routes/notes';
import summaryRoutes from './routes/summaries';
import { loggerMiddleware } from './middleware/logger';
import { rateLimiterMiddleware } from './middleware/rateLimiter';
import { swaggerSpec } from './config/swagger';

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(loggerMiddleware);

  // Swagger documentation (no rate limiting)
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Health check endpoint
   *     tags: [System]
   *     security: []
   *     responses:
   *       200:
   *         description: API is healthy
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Health'
   */
  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  /**
   * @swagger
   * /:
   *   get:
   *     summary: Welcome endpoint
   *     tags: [System]
   *     security: []
   *     responses:
   *       200:
   *         description: Welcome message with available endpoints
   */
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      message: 'Welcome to Octicode Challenge 3 - Medical Records API',
      endpoints: {
        patients: '/api/patients',
        notes: '/api/notes',
        summaries: '/api/summaries',
        health: '/health',
        docs: '/api-docs',
      },
    });
  });

  // Apply rate limiting only to API routes
  app.use('/api', rateLimiterMiddleware);

  app.use('/api/patients', patientRoutes);
  app.use('/api/notes', noteRoutes);
  app.use('/api/summaries', summaryRoutes);

  return app;
};
