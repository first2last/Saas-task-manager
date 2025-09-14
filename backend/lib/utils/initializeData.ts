import bcrypt from 'bcryptjs';
import { Tenant } from '../models/Tenant';
import { User } from '../models/User';

export const initializeTestData = async () => {
  try {
    // Create tenants if they don't exist
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

    // Get tenant IDs
    const acme = await Tenant.findOne({ slug: 'acme' });
    const globex = await Tenant.findOne({ slug: 'globex' });

    if (!acme || !globex) return;

    // Create test users
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
