import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Import your routes
import authRoutes from '../lib/routes/authRoutes';
import notesRoutes from '../lib/routes/notesRoutes';
import tenantRoutes from '../lib/routes/tenantRoutes';
import { initializeTestData } from '../lib/utils/initializeData';

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://saas-task-manager-zlzy-lwtzlfgy1-first2lasts-projects.vercel.app',
  /^https:\/\/saas-task-manager-.*\.vercel\.app$/,
];

const corsOptions = {
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
    callback(null, isAllowed);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id'],
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to MongoDB');
    await initializeTestData();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

connectDB();

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to SaaS Notes API',
    status: 'success',
    endpoints: {
      health: '/health',
      auth: '/auth/login', 
      notes: '/notes',
      tenants: '/tenants'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount API routes - THIS IS CRITICAL
app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);
app.use('/tenants', tenantRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: ['/', '/health', '/auth/login', '/notes', '/tenants']
  });
});

// Export for Vercel serverless function
export default app;
