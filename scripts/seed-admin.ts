// Script to create default admin user for initial deployment
import { db } from '../server/db';
import { users } from '../shared/schema';
import { hashPassword } from '../server/authMiddleware';
import { eq } from 'drizzle-orm';

async function seedAdmin() {
  try {
    console.log('🌱 Checking for existing admin user...');
    
    // Check if admin already exists
    const existingAdmin = await db.select().from(users).where(eq(users.email, 'admin@padidoc.com'));
    
    if (existingAdmin.length > 0) {
      console.log('✅ Admin user already exists!');
      return;
    }

    console.log('📝 Creating default admin user...');
    
    // Hash the default password
    const hashedPassword = await hashPassword('admin123');
    
    // Create admin user
    const adminUser = await db.insert(users).values({
      username: 'Admin PadiDoc',
      email: 'admin@padidoc.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true
    }).returning();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@padidoc.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change this password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the seed function
seedAdmin();