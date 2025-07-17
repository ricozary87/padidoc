// Script to generate secure secrets for production deployment
import crypto from 'crypto';

// Generate a secure random string
function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, length);
}

console.log('=== Generated Secure Secrets for Production ===\n');

const jwtSecret = generateSecret(64);
const sessionSecret = generateSecret(64);

console.log('JWT_SECRET=' + jwtSecret);
console.log('SESSION_SECRET=' + sessionSecret);
console.log('NODE_ENV=production');
console.log('\n=== Instructions ===');
console.log('1. Copy the above environment variables');
console.log('2. In Replit deployment settings, add these as Secrets');
console.log('3. DATABASE_URL is already provided by Replit PostgreSQL');
console.log('4. These secrets are unique and secure for production use');
console.log('\n=== Security Note ===');
console.log('Never commit these secrets to version control!');
console.log('Always use Replit Secrets for sensitive data.');