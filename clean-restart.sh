#!/bin/bash

# Clean and restart script for React dev server
# Fixes React hooks errors caused by caching

echo "=========================================="
echo "Cleaning React Dev Environment"
echo "=========================================="
echo ""

# Stop any running dev servers
echo "1. Stopping any running dev servers..."
pkill -f "vite" 2>/dev/null || true
sleep 1

# Clean all caches
echo "2. Cleaning Vite cache..."
rm -rf node_modules/.vite
rm -rf .vite
rm -rf dist

# Clean browser cache directories that might interfere
echo "3. Cleaning build artifacts..."
find . -name "*.vite" -type d -exec rm -rf {} + 2>/dev/null || true

# Clear npm cache (optional, but helpful)
echo "4. Clearing npm cache..."
npm cache clean --force 2>/dev/null || true

echo ""
echo "=========================================="
echo "Starting Fresh Dev Server"
echo "=========================================="
echo ""

# Start dev server
echo "Starting Vite dev server on port 5174..."
npm run dev
