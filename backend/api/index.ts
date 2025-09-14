import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';

// Import your routes (adjust paths)
import authRoutes from '../lib/routes/authRoutes';
import notesRoutes from '../lib/routes/notesRoutes';
import tenantRoutes from '../lib/routes/tenantRoutes';
import healthRoute from '../lib/routes/healthRoute';

// Import models for initialization
import { initializeTestData } from '../lib/utils/initializeData';

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP'
});

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://saas-task-manager.vercel.app',
  /^https:\/\/saas-task-manager-.*\.vercel\.app$/,
];

const corsOptions: cors.CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id'],
  preflightContinue: false,
  optionsSuccessStatus: 200
};

// Middleware
app.use(limiter);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB and initialize data
const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');
    await initializeTestData();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

// Initialize DB connection
connectDB();

// Routes
app.use('/api/health', healthRoute);
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/tenants', tenantRoutes);

// Handle root route
app.get('/api', (req, res) => {
  res.json({ message: 'SaaS Notes API is running!' });
});

// Export the Express app as a serverless function
export default app;
