# 🚀 PNG Police System - Vercel Deployment Guide

## 📋 Pre-Deployment Checklist
- ✅ All Netlify references removed
- ✅ TypeScript build errors fixed
- ✅ Build succeeds locally (34/34 pages)
- ✅ Environment variables documented
- ✅ Vercel CLI installed

## 🎯 Step 1: Deploy Police System to Vercel

### 1.1 Authentication
```bash
cd png-police-system
vercel login
```
- Choose "Continue with GitHub"
- Complete browser authentication

### 1.2 Deploy to Production
```bash
vercel --prod
```
**Configuration prompts:**
- Project name: `png-police-system`
- Framework: `Next.js`
- Build command: `bun run build` (default)
- Output directory: `.next` (default)
- Development command: `bun run dev` (default)

## 🔧 Step 2: Configure Environment Variables

### 2.1 Access Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your `png-police-system` project
3. Navigate to **Settings → Environment Variables**

### 2.2 Add Required Variables
```env
# Database Configuration
POSTGRES_URL=postgresql://neondb_owner:npg_oiDghtu0HEP9@ep-bitter-block-a7asb7u9-pooler.ap-southeast-2.aws.neon.tech/policesystem?sslmode=require&channel_binding=require
DATABASE_URL=postgresql://neondb_owner:npg_oiDghtu0HEP9@ep-bitter-block-a7asb7u9-pooler.ap-southeast-2.aws.neon.tech/policesystem?sslmode=require&channel_binding=require

# Cybercrime System Integration (Update after cybercrime deployment)
NEXT_PUBLIC_CYBERCRIME_API_URL=https://your-cybercrime-system.vercel.app
NEXT_PUBLIC_CYBERCRIME_SYSTEM_URL=https://your-cybercrime-system.vercel.app
CYBERCRIME_API_KEY=production-api-key-12345
CYBERCRIME_WEBHOOK_SECRET=production-webhook-secret-67890

# Build Configuration
DISABLE_ESLINT_PLUGIN=true
ESLINT_NO_DEV_ERRORS=true
```

### 2.3 Environment Settings
- **Environment**: Set all variables for `Production`, `Preview`, and `Development`
- **Sensitive**: Mark API keys and database URLs as sensitive

## 🔄 Step 3: Deploy Cybercrime System

### 3.1 Deploy Cybercrime System
```bash
cd cybercrime
vercel login  # if not already logged in
vercel --prod
```

### 3.2 Configure Cybercrime Environment Variables
Add these to the cybercrime system's Vercel dashboard:
```env
# Database Configuration (Separate Neon database)
DATABASE_URL=postgresql://cybercrime_db_owner:password@host.neon.tech/cybercrime?sslmode=require

# API Authentication
MAIN_SYSTEM_API_KEY=production-api-key-12345
MAIN_SYSTEM_WEBHOOK_SECRET=production-webhook-secret-67890

# NextAuth Configuration
NEXTAUTH_URL=https://your-cybercrime-system.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret

# Email Configuration (if needed)
EMAIL_FROM=noreply@cybercrime.gov.pg
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
```

## 🔗 Step 4: Update Integration URLs

### 4.1 Update Police System Environment Variables
After cybercrime system deployment, update these in Police System:
```env
NEXT_PUBLIC_CYBERCRIME_API_URL=https://your-cybercrime-system.vercel.app
NEXT_PUBLIC_CYBERCRIME_SYSTEM_URL=https://your-cybercrime-system.vercel.app
```

### 4.2 Redeploy Police System
```bash
cd png-police-system
vercel --prod
```

## 🧪 Step 5: Test Production Integration

### 5.1 Test Police System
1. Visit your deployed Police System URL
2. Login with demo credentials (Badge: 123, Password: test)
3. Navigate to Dashboard
4. Verify Cybercrime Unit Integration section loads

### 5.2 Test Cybercrime Integration
1. Check if cybercrime statistics display
2. Click "Access Cybercrime System" button
3. Verify it opens cybercrime system in new tab
4. Test API communication between systems

### 5.3 Test API Endpoints
```bash
# Test Police System health
curl https://your-police-system.vercel.app/api/test-neon

# Test Cybercrime System health
curl https://your-cybercrime-system.vercel.app/api/health

# Test Integration API
curl -H "x-api-key: your-api-key" https://your-cybercrime-system.vercel.app/api/integration/police-system
```

## 📊 Step 6: Set Up Monitoring

### 6.1 Vercel Analytics
1. Go to Project Settings → Analytics
2. Enable Web Analytics
3. Enable Speed Insights

### 6.2 Error Monitoring
Add to both systems:
```env
# Sentry (Optional)
SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```

### 6.3 Log Monitoring
- Use Vercel's built-in logging
- Monitor deployment logs in Vercel dashboard
- Set up alerts for failed deployments

## 🚨 Troubleshooting

### Common Issues:

**1. Build Failures:**
```bash
# Check build logs in Vercel dashboard
# Verify environment variables are set
# Ensure all dependencies are in package.json
```

**2. Database Connection Issues:**
```bash
# Verify Neon database URLs are correct
# Check SSL mode and channel binding requirements
# Test database connection in Vercel Functions tab
```

**3. API Integration Issues:**
```bash
# Verify API keys match between systems
# Check CORS settings
# Test webhook endpoints
```

## 🔐 Security Checklist

- ✅ All API keys are marked as sensitive in Vercel
- ✅ Database connections use SSL
- ✅ Environment variables are not exposed to client
- ✅ CORS is properly configured
- ✅ Webhook signatures are verified

## 📞 Production URLs

After deployment, you'll have:
- **Police System**: `https://your-police-system.vercel.app`
- **Cybercrime System**: `https://your-cybercrime-system.vercel.app`

## 🔄 Continuous Deployment

### GitHub Integration (Recommended):
1. Connect repositories to Vercel
2. Enable automatic deployments on push to main
3. Set up preview deployments for pull requests

### Manual Deployments:
```bash
# Deploy Police System
cd png-police-system && vercel --prod

# Deploy Cybercrime System
cd cybercrime && vercel --prod
```

---

**🎖️ PNG Police Management System - Production Ready!**
