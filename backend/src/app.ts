import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes';
import notesRoutes from './routes/notesRoutes';
import tenantRoutes from './routes/tenantRoutes';
import healthRoute from './routes/healthRoute';

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP',
});

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://saas-task-manager.vercel.app',
  /^https:\/\/saas-task-manager-.*\.vercel\.app$/,
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow non-browser requests

    const isAllowed = allowedOrigins.some((allowedOrigin) =>
      typeof allowedOrigin === 'string'
        ? allowedOrigin === origin
        : allowedOrigin.test(origin)
    );

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id'],
};

// Apply middlewares in correct order
app.use(limiter);
app.use(cors(corsOptions)); // CORS middleware

// Explicit preflight handler
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/health', healthRoute);
app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);
app.use('/tenants', tenantRoutes);

// Error handling middleware
app.use(
  (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  }
);

export default app;
