#!/bin/bash

# 🧪 PNG Police System - Production Testing Script

echo "🎖️  PNG Police Management System - Production Testing"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
POLICE_SYSTEM_URL=""
CYBERCRIME_SYSTEM_URL=""
API_KEY=""

# Get URLs from user if not set
if [ -z "$POLICE_SYSTEM_URL" ]; then
    echo -n "Enter Police System URL (e.g., https://your-police-system.vercel.app): "
    read POLICE_SYSTEM_URL
fi

if [ -z "$CYBERCRIME_SYSTEM_URL" ]; then
    echo -n "Enter Cybercrime System URL (e.g., https://your-cybercrime-system.vercel.app): "
    read CYBERCRIME_SYSTEM_URL
fi

if [ -z "$API_KEY" ]; then
    echo -n "Enter API Key: "
    read API_KEY
fi

echo ""
echo -e "${BLUE}Testing Police System...${NC}"

# Test Police System Health
echo -n "🔍 Police System Health Check: "
POLICE_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$POLICE_SYSTEM_URL/api/test-neon")
if [ "$POLICE_HEALTH" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL (HTTP $POLICE_HEALTH)${NC}"
fi

# Test Police System Main Page
echo -n "🏠 Police System Main Page: "
POLICE_MAIN=$(curl -s -o /dev/null -w "%{http_code}" "$POLICE_SYSTEM_URL")
if [ "$POLICE_MAIN" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL (HTTP $POLICE_MAIN)${NC}"
fi

echo ""
echo -e "${BLUE}Testing Cybercrime System...${NC}"

# Test Cybercrime System Health
echo -n "🔍 Cybercrime System Health Check: "
CYBER_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$CYBERCRIME_SYSTEM_URL/api/health")
if [ "$CYBER_HEALTH" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL (HTTP $CYBER_HEALTH)${NC}"
fi

# Test Cybercrime System Main Page
echo -n "🏠 Cybercrime System Main Page: "
CYBER_MAIN=$(curl -s -o /dev/null -w "%{http_code}" "$CYBERCRIME_SYSTEM_URL")
if [ "$CYBER_MAIN" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL (HTTP $CYBER_MAIN)${NC}"
fi

echo ""
echo -e "${BLUE}Testing Integration...${NC}"

# Test Integration API
echo -n "🔗 Integration API: "
INTEGRATION=$(curl -s -o /dev/null -w "%{http_code}" -H "x-api-key: $API_KEY" "$CYBERCRIME_SYSTEM_URL/api/integration/police-system")
if [ "$INTEGRATION" = "200" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL (HTTP $INTEGRATION)${NC}"
fi

# Test Cross-Origin Configuration
echo -n "🌐 CORS Configuration: "
CORS=$(curl -s -o /dev/null -w "%{http_code}" -H "Origin: $POLICE_SYSTEM_URL" "$CYBERCRIME_SYSTEM_URL/api/integration/police-system")
if [ "$CORS" = "200" ] || [ "$CORS" = "401" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL (HTTP $CORS)${NC}"
fi

echo ""
echo -e "${BLUE}Testing Database Connections...${NC}"

# Test Police System Database
echo -n "🗄️  Police System Database: "
DB_POLICE=$(curl -s "$POLICE_SYSTEM_URL/api/test-neon" | grep -o '"connected":[^,]*' | cut -d':' -f2)
if [ "$DB_POLICE" = "true" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
else
    echo -e "${RED}❌ FAIL${NC}"
fi

echo ""
echo -e "${YELLOW}🔧 Manual Testing Required:${NC}"
echo "1. Login to Police System: $POLICE_SYSTEM_URL"
echo "2. Navigate to Dashboard"
echo "3. Check Cybercrime Unit Integration section"
echo "4. Click 'Access Cybercrime System' button"
echo "5. Verify cybercrime system opens in new tab"

echo ""
echo -e "${YELLOW}📊 Monitoring URLs:${NC}"
echo "Police System: $POLICE_SYSTEM_URL"
echo "Cybercrime System: $CYBERCRIME_SYSTEM_URL"
echo "Vercel Dashboard: https://vercel.com/dashboard"

echo ""
echo -e "${GREEN}🎖️  Production Testing Complete!${NC}"
