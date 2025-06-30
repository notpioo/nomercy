#!/bin/bash

# NoMercy Gaming Platform - Railway Deployment Script

echo "🚀 Starting Railway deployment setup..."

# Check if required files exist
echo "📋 Checking required files..."

required_files=("railway.json" "nixpacks.toml" "Procfile" ".env.example" "package.json")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing required file: $file"
        exit 1
    else
        echo "✅ Found: $file"
    fi
done

# Verify build dependencies
echo "🔍 Checking build dependencies..."
if ! grep -q "\"vite\"" package.json; then
    echo "❌ Vite not found in package.json"
    exit 1
fi

if ! grep -q "\"esbuild\"" package.json; then
    echo "❌ ESBuild not found in package.json"
    exit 1
fi

echo "✅ Build dependencies verified"

# Test local build
echo "🔨 Testing local build..."
npm ci
if [ $? -ne 0 ]; then
    echo "❌ npm ci failed"
    exit 1
fi

npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Local build successful"

# Create git repo if not exists
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for Railway deployment"
fi

echo "🎉 Deployment setup complete!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git remote add origin <your-repo-url> && git push -u origin main"
echo "2. Connect to Railway: railway.app → New Project → Deploy from GitHub"
echo "3. Add PostgreSQL database: New → Database → PostgreSQL"
echo "4. Set environment variables (see .env.example)"
echo "5. Deploy will start automatically"
echo ""
echo "For troubleshooting, check RAILWAY-TROUBLESHOOTING.md"