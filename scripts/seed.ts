import { db } from '../src/lib/db';
import { users } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function seed() {
  try {
    console.log('🚀 Starting database seed...');

    // Check if admin already exists
    const existingAdmin = await db.query.users.findFirst({
      where: eq(users.role, 'admin'),
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.email);
      return;
    }

    // Admin user data - KINDE_ADMIN_ID should be set in environment
    // This will be the Kinde user ID of the admin after they create their account in Kinde
    const adminKindeId = process.env.KINDE_ADMIN_ID;
    
    if (!adminKindeId) {
      console.log('⚠️  Please set KINDE_ADMIN_ID in your environment variables');
      console.log('   1. Create an admin account in Kinde');
      console.log('   2. Get the user ID from Kinde dashboard');
      console.log('   3. Set KINDE_ADMIN_ID=your-kinde-user-id in .env.local');
      console.log('   4. Run this script again');
      return;
    }

    const adminData = {
      kindeId: adminKindeId,
      email: process.env.ADMIN_EMAIL || 'admin@rockefvsfc.com',
      fullName: process.env.ADMIN_NAME || 'Admin User',
      phone: process.env.ADMIN_PHONE || '',
      role: 'admin' as const,
    };

    // Insert admin user
    const [admin] = await db.insert(users).values(adminData).returning();

    console.log('✅ Admin user created successfully!');
    console.log('   Email:', admin.email);
    console.log('   Full Name:', admin.fullName);
    console.log('   Role:', admin.role);
    console.log('   User ID:', admin.id);

    // Create a welcome notification for the admin
    const { notifications } = await import('../src/lib/db/schema');
    
    await db.insert(notifications).values({
      userId: admin.id,
      title: 'Welcome to ROCKEFVSFC Manager 2.0',
      message: 'Your admin account has been successfully created. You now have access to all management features including player management, invoicing, and payment tracking.',
      read: false,
    });

    console.log('✅ Welcome notification created for admin');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seed();