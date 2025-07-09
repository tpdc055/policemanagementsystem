#!/bin/bash

# 🎖️ PNG Police Management System - Vercel Deployment Script
# Royal Papua New Guinea Constabulary

echo "🎖️  PNG Police Management System - Vercel Deployment"
echo "==============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from the project root."
    exit 1
fi

echo "📋 Pre-deployment checks..."

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "⚠️  Bun not found. Installing bun..."
    curl -fsSL https://bun.sh/install | bash
fi

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Test build locally
echo "🏗️  Testing build locally..."
if bun run build; then
    echo "✅ Local build successful!"
else
    echo "❌ Local build failed. Please fix errors before deploying."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "🔧 Vercel CLI not found. Installing..."
    npm i -g vercel
fi

echo ""
echo "🚀 Ready for Vercel deployment!"
echo ""
echo "Next steps:"
echo "1. Run: vercel login"
echo "2. Run: vercel --prod"
echo "3. Configure environment variables in Vercel dashboard"
echo ""
echo "Environment variables to set:"
echo "- POSTGRES_URL (Neon PostgreSQL connection string)"
echo "- DATABASE_URL (Same as POSTGRES_URL)"
echo "- NEXT_PUBLIC_CYBERCRIME_API_URL (Production cybercrime system URL)"
echo "- NEXT_PUBLIC_CYBERCRIME_SYSTEM_URL (Production cybercrime system URL)"
echo "- CYBERCRIME_API_KEY (API key for cybercrime integration)"
echo "- CYBERCRIME_WEBHOOK_SECRET (Webhook secret for cybercrime alerts)"
echo "- DISABLE_ESLINT_PLUGIN=true"
echo "- ESLINT_NO_DEV_ERRORS=true"
echo ""
echo "🎖️  PNG Police System ready for production!"
