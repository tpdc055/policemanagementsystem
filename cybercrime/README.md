# 🚀 PNG Police Cyber Crime Monitoring System

A comprehensive, production-ready cyber crime monitoring and investigation management system for the Royal Papua New Guinea Police Force.

## 🎯 System Overview

This is a complete, independent cyber crime monitoring platform featuring:

- **Advanced Case Management** - Complete lifecycle from intake to resolution
- **Evidence Management** - Secure digital evidence handling with chain of custody
- **Social Media Monitoring** - Multi-platform tracking and analysis
- **Legal Request Coordination** - Platform liaison and data request management
- **Real-time Analytics** - Comprehensive reporting and insights
- **Knowledge Base** - Threat intelligence and investigation resources
- **User Management** - Role-based access control and security
- **Real-time Notifications** - Live updates and email alerts

## ✨ Key Features

### 🔐 Enterprise Security
- NextAuth.js authentication with role-based access control
- Comprehensive audit logging for all user actions
- Secure file upload with validation and chain of custody
- Protected API endpoints with authorization middleware

### 📊 Real-time Intelligence
- Live dashboard with case statistics and trends
- WebSocket-powered real-time notifications
- Email alert system for urgent cases
- Geographic and demographic analysis

### 🔗 System Integration
- REST API endpoints for main police system integration
- Webhook support for external system communication
- Database-driven architecture with PostgreSQL
- Scalable file storage system

### 👥 User Roles & Permissions
- **Admin** - Full system access and user management
- **Unit Commander** - Oversight and reporting capabilities
- **Senior Investigator** - Lead investigations and case management
- **Investigator** - Case handling and evidence management
- **Analyst** - Data analysis and forensics support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (with Bun recommended)
- PostgreSQL 12+ database
- SMTP email service

### Installation

1. **Clone and Install**:
   ```bash
   git clone https://github.com/tpdc055/cybercrime.git
   cd cybercrime
   bun install
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your database and email credentials
   ```

3. **Database Setup**:
   ```bash
   bun run setup
   # This runs: prisma generate + migrate + seed
   ```

4. **Start Development Server**:
   ```bash
   bun run dev
   ```

5. **Access System**:
   - Open http://localhost:3000
   - Use test accounts (see Database Setup Guide)

## 🏗️ Production Deployment

### Quick Deploy Options

**Option 1: Netlify (Recommended)**
- Deploy as dynamic site with database addon
- Automatic SSL and global CDN
- Built-in form handling and serverless functions

**Option 2: Vercel**
- Optimized for Next.js applications
- Automatic deployments from Git
- Edge network for global performance

**Option 3: Traditional Server**
- Ubuntu/Linux server with Nginx
- PM2 process management
- Full control over infrastructure

## 🏆 Production Features

This system is enterprise-ready with:
- ✅ Complete authentication and authorization
- ✅ Production-grade database schema
- ✅ Secure API endpoints with validation
- ✅ Real-time notifications and email alerts
- ✅ Comprehensive audit logging
- ✅ Professional UI/UX design
- ✅ Security best practices implemented
- ✅ Scalable architecture
- ✅ Integration capabilities

## 📄 License

Developed for the Royal Papua New Guinea Police Force Cyber Crime Unit.

---

**Royal Papua New Guinea Police Force**
*Cyber Crime Monitoring System v1.0*