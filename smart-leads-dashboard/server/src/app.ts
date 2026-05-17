import './types/express.augment';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth.routes';
import leadsRoutes from './routes/leads.routes';
import swaggerSpec from './swagger';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const normalizedOrigin = origin.replace(/\/$/, '');
    
    // Check if origin is explicitly allowed or is a Vercel preview domain
    const isAllowed = allowedOrigins.some(allowed => allowed.replace(/\/$/, '') === normalizedOrigin)
      || normalizedOrigin.endsWith('.vercel.app');
      
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Swagger documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs/swagger.json', (_req: Request, res: Response) => {
  res.json(swaggerSpec);
});




app.use('/api', authRoutes);
app.use('/api', leadsRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = (err as Error & { statusCode?: number }).statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  if (statusCode === 500) {
    console.error('Unhandled error:', err);
  }

  res.status(statusCode).json({ success: false, message });
});

export default app;
