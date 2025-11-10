#!/bin/bash
set -e

echo "🚀 Setting up Atlanticfreway development environment..."

# Install root dependencies
npm install

# Setup API
echo "📦 Setting up API..."
cd apps/api
npm install
npx prisma generate
cd ../..

# Setup Web
echo "🌐 Setting up Web app..."
cd apps/web
npm install
cd ../..

# Setup Partner Portal
echo "👥 Setting up Partner Portal..."
cd apps/partner-portal
npm install
cd ../..

echo "✅ Setup complete! Run 'npm run dev' to start all services."