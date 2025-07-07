# 🚀 GitHub → Vercel Deployment Guide
## PNG Police Management System

### Repository: `tpdc055/policemanagementsystem`

## 📋 Quick Deployment Steps

### 1. Connect to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Sign in with your GitHub account
3. Click "Import Git Repository"
4. Search for `tpdc055/policemanagementsystem`
5. Click "Import"

### 2. Project Configuration
```
Project Name: png-police-system
Framework: Next.js
Root Directory: png-police-system (if needed)
Build Command: bun run build
Output Directory: .next
Install Command: bun install
```

### 3. Environment Variables (COPY & PASTE)
Add these in the Vercel deployment configuration:

```env
# Database Configuration
POSTGRES_URL=postgresql://neondb_owner:npg_oiDghtu0HEP9@ep-bitter-block-a7asb7u9-pooler.ap-southeast-2.aws.neon.tech/policesystem?sslmode=require&channel_binding=require
DATABASE_URL=postgresql://neondb_owner:npg_oiDghtu0HEP9@ep-bitter-block-a7asb7u9-pooler.ap-southeast-2.aws.neon.tech/policesystem?sslmode=require&channel_binding=require

# Cybercrime Integration (Update after cybercrime deployment)
NEXT_PUBLIC_CYBERCRIME_API_URL=https://YOUR-CYBERCRIME-SYSTEM.vercel.app
NEXT_PUBLIC_CYBERCRIME_SYSTEM_URL=https://YOUR-CYBERCRIME-SYSTEM.vercel.app
CYBERCRIME_API_KEY=production-api-key-12345
CYBERCRIME_WEBHOOK_SECRET=production-webhook-secret-67890

# Build Configuration
DISABLE_ESLINT_PLUGIN=true
ESLINT_NO_DEV_ERRORS=true
```

### 4. Deploy Police System
- Click "Deploy"
- Wait 2-3 minutes for build to complete
- Note your deployment URL: `https://your-police-system.vercel.app`

### 5. Deploy Cybercrime System (Separate)
1. Go to [vercel.com/new](https://vercel.com/new) again
2. Import the same repository
3. Set Root Directory to: `cybercrime`
4. Project Name: `cybercrime-system`
5. Add cybercrime environment variables:

```env
# Cybercrime System Database (Separate Neon instance)
DATABASE_URL=postgresql://cybercrime_db_owner:password@host.neon.tech/cybercrime?sslmode=require

# API Authentication (Match police system)
MAIN_SYSTEM_API_KEY=production-api-key-12345
MAIN_SYSTEM_WEBHOOK_SECRET=production-webhook-secret-67890

# NextAuth Configuration
NEXTAUTH_URL=https://your-cybercrime-system.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-here
```

### 6. Update Police System URLs
1. Go to Police System project in Vercel dashboard
2. Settings → Environment Variables
3. Update these with your actual cybercrime URLs:
   ```env
   NEXT_PUBLIC_CYBERCRIME_API_URL=https://your-cybercrime-system.vercel.app
   NEXT_PUBLIC_CYBERCRIME_SYSTEM_URL=https://your-cybercrime-system.vercel.app
   ```
4. Redeploy the police system

## 🧪 Testing Your Deployment

### Test Police System:
1. Visit your police system URL
2. Login with demo credentials:
   - Badge Number: `123`
   - Password: `test`
   - Role: Any role
3. Navigate to Dashboard
4. Check "Cybercrime Unit Integration" section
5. Click "Access Cybercrime System" button

### Test Health Endpoints:
- Police System: `https://your-police-system.vercel.app/api/health`
- Cybercrime System: `https://your-cybercrime-system.vercel.app/api/health`

## 🔄 Automatic Deployments
Once connected:
- ✅ Push to `main` branch = Automatic production deployment
- ✅ Pull requests = Preview deployments
- ✅ Easy rollbacks via Vercel dashboard
- ✅ Deployment notifications

## 📊 Your Production URLs
After deployment:
- **Police System**: `https://png-police-system-[random].vercel.app`
- **Cybercrime System**: `https://cybercrime-system-[random].vercel.app`

## 🚨 Important Notes
1. **Two Separate Deployments**: Police and Cybercrime systems deploy separately
2. **Update URLs**: After cybercrime deployment, update police system environment variables
3. **Database Setup**: Ensure both Neon PostgreSQL databases are configured
4. **API Keys**: Use the same API keys in both systems for integration

## ✅ Success Checklist
- [ ] Police system accessible
- [ ] Login functionality works
- [ ] Dashboard displays correctly
- [ ] Cybercrime integration section loads
- [ ] Cybercrime system accessible
- [ ] API communication between systems works
- [ ] Health checks respond correctly

---

**🎖️ Royal Papua New Guinea Constabulary - GitHub Deployment Complete!**
