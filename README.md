# 🚔 Royal Papua New Guinea Constabulary - Police Management System

A comprehensive police management system with integrated cybercrime capabilities, built with Next.js and deployed on Vercel.

## 🌟 Features

### Core Police Management
- **Dashboard**: Real-time police operations overview
- **Incident Management**: Report and track incidents
- **Case Management**: Investigate and manage cases
- **Personnel Management**: Officer profiles and assignments
- **Evidence Management**: Digital evidence tracking
- **Criminal Records**: Comprehensive criminal database
- **Audit Trail**: Complete system activity logging

### 🔐 Cybercrime Integration
- **Real-time Statistics**: Live cybercrime data integration
- **Secure System Linking**: Direct access to standalone cybercrime system
- **Webhook Notifications**: Urgent cybercrime case alerts
- **Consolidated Reporting**: Combined police and cybercrime analytics

## 🏗️ Architecture

### Database Configuration
- **Police System Database**: Neon PostgreSQL (`policesystem` database)
- **Cybercrime System Database**: Separate Neon PostgreSQL (`cybercrime` database)
- **Integration**: API-based communication between systems

### Deployment
- **Platform**: Vercel
- **Framework**: Next.js 15
- **Runtime**: Node.js 18
- **Package Manager**: Bun

## 🚀 Deployment to Vercel

### Prerequisites
1. Vercel account
2. Neon PostgreSQL database (`policesystem`)
3. Cybercrime system deployed separately

### Environment Variables
Configure these in your Vercel dashboard:

```env
# Police System Database
POSTGRES_URL=postgresql://neondb_owner:password@host.neon.tech/policesystem?sslmode=require
DATABASE_URL=postgresql://neondb_owner:password@host.neon.tech/policesystem?sslmode=require

# Cybercrime System Integration
NEXT_PUBLIC_CYBERCRIME_API_URL=https://your-cybercrime-system.vercel.app
NEXT_PUBLIC_CYBERCRIME_SYSTEM_URL=https://your-cybercrime-system.vercel.app
CYBERCRIME_API_KEY=your-production-api-key
CYBERCRIME_WEBHOOK_SECRET=your-production-webhook-secret

# API Authentication
MAIN_SYSTEM_API_KEY=your-production-api-key
MAIN_SYSTEM_WEBHOOK_SECRET=your-production-webhook-secret
```

### Deployment Steps
1. **Clone the repository**
2. **Install Vercel CLI**: `npm i -g vercel`
3. **Deploy**: `vercel --prod`
4. **Configure environment variables** in Vercel dashboard
5. **Redeploy** after environment setup

### Automatic Deployment
- **Git Integration**: Auto-deploy on push to main branch
- **Preview Deployments**: Created for pull requests
- **Build Optimization**: TypeScript and ESLint errors ignored for demo

## 🧪 Testing the Integration

### Login Credentials (Demo)
- **Badge Number**: Any number (e.g., "123")
- **Password**: Any text (e.g., "test")
- **Role**: Select any role

### Testing Cybercrime Integration
1. Login to police system
2. Navigate to dashboard
3. Scroll to "Cybercrime Unit Integration" section
4. Verify statistics display
5. Click "Access Cybercrime System" to open separate system

## 🔧 Development

### Local Development
```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Open browser
http://localhost:3000
```

### Database Setup
1. Create `policesystem` database in Neon
2. Update environment variables
3. Run database migrations (if implemented)

## 📁 Project Structure

```
png-police-system/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── dashboard/          # Police dashboard
│   │   ├── incidents/          # Incident management
│   │   ├── cases/              # Case management
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── layout/             # Layout components
│   │   └── ui/                 # UI components (shadcn)
│   └── lib/                    # Utilities and services
│       ├── cybercrime-api.ts   # Cybercrime integration
│       └── database.ts         # Database utilities
├── vercel.json                 # Vercel configuration
└── next.config.js             # Next.js configuration
```

## 🛡️ Security Features

- **API Authentication**: Secure API keys for system integration
- **Webhook Verification**: HMAC signature verification
- **Environment Isolation**: Separate development and production configs
- **Database Security**: SSL-required connections to Neon PostgreSQL

## 🔄 Integration with Cybercrime System

The police system integrates with a separate cybercrime system to provide:

1. **Consolidated Dashboard**: Cybercrime statistics in police dashboard
2. **Secure Access**: Direct link to cybercrime system
3. **Real-time Alerts**: Webhook notifications for urgent cases
4. **Independent Operations**: Both systems maintain autonomy

## 📞 Support

For technical support or deployment issues:
- Check Vercel deployment logs
- Verify environment variables
- Ensure database connectivity
- Review API endpoint configurations

---

**Deployed with ❤️ on Vercel**
