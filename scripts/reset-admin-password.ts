// Script to reset admin password
import { db } from '../server/db';
import { users } from '../shared/schema';
import { hashPassword } from '../server/authMiddleware';
import { eq } from 'drizzle-orm';

async function resetAdminPassword() {
  try {
    console.log('🔄 Resetting admin password...');
    
    // Hash the new password
    const hashedPassword = await hashPassword('admin123');
    
    // Update admin password
    await db.update(users)
      .set({ 
        password: hashedPassword,
        updatedAt: new Date()
      })
      .where(eq(users.email, 'admin@padidoc.com'));

    console.log('✅ Admin password reset successfully!');
    console.log('📧 Email: admin@padidoc.com');
    console.log('🔑 Password: admin123');
    console.log('⚠️  Please change this password after first login!');
    
  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the reset function
resetAdminPassword();