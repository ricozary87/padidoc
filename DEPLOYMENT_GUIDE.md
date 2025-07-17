# PadiDoc Production Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Environment Variables Setup
Add these secrets in Replit Deployment Settings:

```
JWT_SECRET=hdY8xJLapqZYxDZoC1jAA7OWqyuWo7vvvv7rijh11x7VlB6ps4Ie9NZuPHi4Mscb
SESSION_SECRET=a58aX64gouHvS4QHfsNJ3nDE9HRCSPcsXrsQXhssd408mkhAqjFoNWiVPDlDpBa8
NODE_ENV=production
```

**Note**: DATABASE_URL is automatically provided by Replit PostgreSQL

### 2. Deployment Configuration
Your deployment is already configured in `.replit`:
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Port**: 5000 (auto-mapped to 80)
- **Autoscale**: 4 vCPUs, 3 machines

### 3. Deploy Steps
1. Go to Deployments tab in Replit
2. Click "Deploy" button
3. Add the environment variables as Secrets
4. Confirm deployment

### 4. Post-Deployment Testing

#### Test Login Endpoint:
```bash
curl -X POST https://your-app.replit.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@padidoc.com", "password": "admin123"}'
```

#### Test Pembelian Endpoint (with token):
```bash
curl -X GET https://your-app.replit.app/api/pembelian \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Test Laporan Endpoint (admin only):
```bash
curl -X GET https://your-app.replit.app/api/laporan \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN_HERE"
```

## 📝 Default Admin Credentials
- Email: `admin@padidoc.com`
- Password: `admin123`

**Important**: Change this password immediately after first login!

## 🔒 Security Checklist
- [x] JWT secret is strong and unique
- [x] Session secret is strong and unique
- [x] Database connection is secured by Replit
- [x] HTTPS is automatically enabled by Replit
- [x] Role-based access control is implemented
- [x] Input validation is active
- [x] Stock validation prevents overselling

## 📊 Monitoring
- Check deployment logs in Replit console
- Monitor database connections in PostgreSQL dashboard
- Review activity logs at `/aktivitas-user` (admin only)

## 🆘 Troubleshooting

### If deployment fails:
1. Check build logs for errors
2. Verify all dependencies are in package.json
3. Ensure database migrations are applied

### If API returns 401/403:
1. Check JWT token is valid
2. Verify user role permissions
3. Ensure user account is active

### If stock updates fail:
1. Check database connection
2. Verify stock exists before transactions
3. Review transaction logs

## 🎯 Production URL
After deployment, your app will be available at:
`https://[your-repl-name].replit.app`

## 📱 Features Ready for Production
- ✅ Authentication & Authorization
- ✅ Auto-stock management
- ✅ Transaction validation
- ✅ PDF invoice generation
- ✅ Financial reporting
- ✅ Activity logging
- ✅ Mobile responsive UI

---
Generated on: January 17, 2025