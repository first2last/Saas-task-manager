import mongoose from 'mongoose';
import app from './app';
import { config } from './config';
import { Tenant } from './models/Tenant';
import { User } from './models/User';
import bcrypt from 'bcryptjs';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Initialize test data
    await initializeTestData();

    // For Vercel, we don't need to listen on a port
    if (process.env.NODE_ENV !== 'production') {
      app.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

// Initialize test data function (same as before)
const initializeTestData = async () => {
  try {
    const acmeTenant = await Tenant.findOne({ slug: 'acme' });
    if (!acmeTenant) {
      await Tenant.create({
        slug: 'acme',
        name: 'Acme Corporation',
        plan: 'free',
        noteLimit: 3
      });
    }

    const globexTenant = await Tenant.findOne({ slug: 'globex' });
    if (!globexTenant) {
      await Tenant.create({
        slug: 'globex',
        name: 'Globex Corporation',
        plan: 'free',
        noteLimit: 3
      });
    }

    const acme = await Tenant.findOne({ slug: 'acme' });
    const globex = await Tenant.findOne({ slug: 'globex' });

    if (!acme || !globex) return;

    const hashedPassword = await bcrypt.hash('password', 10);
    const testUsers = [
      { email: 'admin@acme.test', tenantId: acme._id, role: 'admin' },
      { email: 'user@acme.test', tenantId: acme._id, role: 'member' },
      { email: 'admin@globex.test', tenantId: globex._id, role: 'admin' },
      { email: 'user@globex.test', tenantId: globex._id, role: 'member' }
    ];

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create({
          ...userData,
          password: hashedPassword
        });
      }
    }

    console.log('Test data initialized successfully');
  } catch (error) {
    console.error('Failed to initialize test data:', error);
  }
};

startServer();

// Export the app for Vercel
export default app;
