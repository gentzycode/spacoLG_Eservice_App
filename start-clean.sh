#!/bin/bash

# Clean Start Script for Development
# This ensures no cache conflicts with React

echo "🧹 Cleaning Vite cache..."
rm -rf node_modules/.vite
rm -rf dist
rm -rf .vite

echo "🔪 Killing any running Vite processes..."
pkill -f "vite" 2>/dev/null || true

echo "✨ Starting fresh dev server..."
npm run dev
