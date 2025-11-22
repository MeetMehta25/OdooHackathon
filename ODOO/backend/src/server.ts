import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import config from './config/config';
import { testConnection } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import AppError from './middleware/errorHandler';

// Import routes
import userRoutes from './routes/user.routes';

// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({ origin: config.corsOrigin, credentials: true })); // CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(compression()); // Compress responses
app.use(morgan('dev')); // Logging

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/users', userRoutes);

// 404 handler
app.all('*', (req: Request, res: Response) => {
  throw new AppError(`Route ${req.originalUrl} not found`, 404);
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.port;

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`);
      console.log(`📡 API available at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
