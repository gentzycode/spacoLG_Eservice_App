#!/bin/bash

echo "🔧 Starting React Hooks Error Fix..."
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

echo "📦 Step 1: Cleaning old dependencies..."
rm -rf node_modules package-lock.json
rm -rf node_modules/.vite
rm -rf dist
echo "✅ Cleanup complete"
echo ""

echo "🧹 Step 2: Clearing npm cache..."
npm cache clean --force
echo "✅ Cache cleared"
echo ""

echo "📥 Step 3: Installing dependencies with single React version..."
npm install --legacy-peer-deps
echo "✅ Dependencies installed"
echo ""

echo "🔍 Step 4: Verifying React versions..."
npm ls react react-dom
echo ""

echo "✅ Fix complete!"
echo ""
echo "🚀 To start the dev server, run:"
echo "   npm run dev"
echo ""
echo "📋 Check FIX_REACT_ERROR.md for detailed information"
