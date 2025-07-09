#!/bin/bash

# 📊 PNG Police System - Production Monitoring Setup

echo "📊 PNG Police Management System - Monitoring Setup"
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up production monitoring...${NC}"

# 1. Vercel Analytics Setup
echo ""
echo -e "${YELLOW}📈 Vercel Analytics Setup:${NC}"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Select your police-system project"
echo "3. Navigate to Settings → Analytics"
echo "4. Enable 'Web Analytics'"
echo "5. Enable 'Speed Insights'"
echo "6. Repeat for cybercrime-system project"

# 2. Error Monitoring
echo ""
echo -e "${YELLOW}🚨 Error Monitoring Setup:${NC}"
echo "Optional: Set up Sentry for advanced error tracking"
echo "1. Create account at https://sentry.io"
echo "2. Create new projects for both systems"
echo "3. Add these environment variables in Vercel:"
echo "   SENTRY_DSN=your-sentry-dsn"
echo "   SENTRY_ORG=your-org"
echo "   SENTRY_PROJECT=your-project"

# 3. Database Monitoring
echo ""
echo -e "${YELLOW}🗄️  Database Monitoring:${NC}"
echo "Neon PostgreSQL monitoring:"
echo "1. Go to https://console.neon.tech"
echo "2. Select your databases"
echo "3. Check the Monitoring tab"
echo "4. Set up alerts for:"
echo "   - High CPU usage (>80%)"
echo "   - Connection limits (>80%)"
echo "   - Storage usage (>80%)"

# 4. API Monitoring
echo ""
echo -e "${YELLOW}🔗 API Integration Monitoring:${NC}"
echo "Set up health checks for:"
echo "- Police System: /api/test-neon"
echo "- Cybercrime System: /api/health"
echo "- Integration API: /api/integration/police-system"

# 5. Performance Monitoring
echo ""
echo -e "${YELLOW}⚡ Performance Monitoring:${NC}"
echo "Monitor these metrics:"
echo "- Page load times (<3 seconds)"
echo "- API response times (<500ms)"
echo "- Database query performance"
echo "- Cybercrime integration latency"

# 6. Security Monitoring
echo ""
echo -e "${YELLOW}🔐 Security Monitoring:${NC}"
echo "Monitor for:"
echo "- Failed login attempts"
echo "- Unusual API usage patterns"
echo "- Database connection anomalies"
echo "- Webhook verification failures"

# 7. Uptime Monitoring
echo ""
echo -e "${YELLOW}⏱️  Uptime Monitoring:${NC}"
echo "Recommended services:"
echo "- UptimeRobot (free): https://uptimerobot.com"
echo "- Pingdom: https://pingdom.com"
echo "- Better Uptime: https://betteruptime.com"

# Create monitoring health check endpoint
echo ""
echo -e "${BLUE}Creating health check endpoints...${NC}"

# Health check for police system
cat > ../src/app/api/health/route.ts << 'EOF'
import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/database'

export async function GET() {
  try {
    // Test database connection
    const dbHealth = await DatabaseService.testConnection()

    // Test cybercrime integration
    const cybercrimeHealth = await fetch(
      process.env.NEXT_PUBLIC_CYBERCRIME_API_URL + '/api/health',
      {
        headers: { 'x-api-key': process.env.CYBERCRIME_API_KEY || '' },
        timeout: 5000
      }
    ).then(res => res.ok).catch(() => false)

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: dbHealth.success,
        cybercrime_integration: cybercrimeHealth
      },
      uptime: process.uptime()
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    )
  }
}
EOF

echo -e "${GREEN}✅ Health check endpoint created at /api/health${NC}"

# Create monitoring dashboard URL
echo ""
echo -e "${YELLOW}📊 Monitoring Dashboard URLs:${NC}"
echo "After deployment, monitor these URLs:"
echo "- Police System Health: YOUR_POLICE_URL/api/health"
echo "- Cybercrime System Health: YOUR_CYBERCRIME_URL/api/health"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- Neon Dashboard: https://console.neon.tech"

# Alert thresholds
echo ""
echo -e "${YELLOW}🚨 Recommended Alert Thresholds:${NC}"
echo "- Response time: >2 seconds"
echo "- Error rate: >5%"
echo "- Database connections: >80% of limit"
echo "- Memory usage: >85%"
echo "- Disk usage: >90%"

echo ""
echo -e "${GREEN}🎖️  Monitoring setup guide complete!${NC}"
echo -e "${BLUE}Run this script after deployment to test monitoring:${NC}"
echo "./scripts/test-production.sh"
