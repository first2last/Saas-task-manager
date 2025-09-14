import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';

// Import your routes
import authRoutes from '../lib/routes/authRoutes';
import notesRoutes from '../lib/routes/notesRoutes';
import tenantRoutes from '../lib/routes/tenantRoutes';
import healthRoute from '../lib/routes/healthRoute';

// Import models for initialization
import { initializeTestData } from '../lib/utils/initializeData';

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
  'https://saas-task-manager-zlzy-lwtzlfgy1-first2lasts-projects.vercel.app',
  /^https:\/\/saas-task-manager-.*\.vercel\.app$/,
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow non-browser clients (curl, Postman)

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
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

// Apply middlewares
app.use(limiter);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState) {
      return;
    }
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not set in environment');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    await initializeTestData();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit if DB connection fails
  }
};

// Initialize DB connection
connectDB();

// Routes
app.use('/api/health', healthRoute);
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/tenants', tenantRoutes);

// API Info route
app.get('/api', (req, res) => {
  res.json({
    message: 'SaaS Notes API is running!',
    status: 'success',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      notes: '/api/notes',
      tenants: '/api/tenants',
    },
  });
});

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SaaS Notes API',
  });
});

// Export the app
export default app;
