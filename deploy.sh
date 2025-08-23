#!/bin/bash

# Vercel Deployment Script for SaaS Toolkit
echo "🚀 Preparing SaaS Toolkit for Vercel deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "apps/web" ]; then
    echo "❌ Error: Please run this script from the root of the SaaS Toolkit project"
    exit 1
fi

# Build everything to ensure it works
echo "📦 Building all packages..."
pnpm build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix the issues before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🌐 Deploying to Vercel..."
echo ""
echo "📋 Deployment Instructions:"
echo "1. When prompted, choose to set up and deploy"
echo "2. Select your Vercel account"
echo "3. Choose 'No' for linking to existing project"
echo "4. Project name: saas-toolkit (or your preferred name)"
echo "5. Root directory: ./apps/web"
echo "6. Override settings: Yes"
echo "7. Build command: pnpm build"
echo "8. Output directory: .next"
echo "9. Install command: cd ../.. && pnpm install"
echo "10. Development command: cd ../.. && pnpm dev"
echo ""

# Deploy to Vercel
vercel

echo ""
echo "🎉 Deployment complete!"
echo "📖 For detailed deployment instructions, see DEPLOYMENT.md"
