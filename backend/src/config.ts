import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/saas-notes',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
  nodeEnv: process.env.NODE_ENV || 'development'
};
