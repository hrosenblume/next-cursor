#!/bin/bash

# =============================================================================
# Prerequisite Checker
# =============================================================================
# Checks if all required tools are installed before starting development.
# Run with: npm run setup:check
# =============================================================================

echo ""
echo "🔍 Checking prerequisites..."
echo ""

errors=0

# Check Node.js
if command -v node &> /dev/null; then
  node_version=$(node -v)
  major_version=$(echo $node_version | cut -d'.' -f1 | tr -d 'v')
  if [ "$major_version" -ge 18 ]; then
    echo "✅ Node.js $node_version"
  else
    echo "⚠️  Node.js $node_version (recommend v18+)"
  fi
else
  echo "❌ Node.js not installed"
  echo "   Install from: https://nodejs.org"
  errors=1
fi

# Check npm
if command -v npm &> /dev/null; then
  echo "✅ npm $(npm -v)"
else
  echo "❌ npm not installed"
  errors=1
fi

# Check git
if command -v git &> /dev/null; then
  echo "✅ Git $(git --version | cut -d' ' -f3)"
else
  echo "❌ Git not installed"
  echo "   Install from: https://git-scm.com"
  errors=1
fi

echo ""
echo "📁 Project status:"

# Check if in a project directory
if [ -f "package.json" ]; then
  echo "✅ In project directory"
else
  echo "❌ Not in project directory (no package.json found)"
  echo "   Run this from your project root"
  errors=1
fi

# Check node_modules
if [ -d "node_modules" ]; then
  echo "✅ Dependencies installed"
else
  echo "⚠️  Dependencies not installed (run: npm install)"
fi

# Check .env.local
if [ -f ".env.local" ]; then
  echo "✅ .env.local exists"
else
  echo "⚠️  .env.local not found (run: cp .env.example .env.local)"
fi

# Check database
if [ -f "prisma/dev.db" ]; then
  echo "✅ Local database exists"
else
  echo "⚠️  Local database not set up (run: npm run db:setup)"
fi

echo ""
if [ $errors -eq 0 ]; then
  echo "✅ All prerequisites met!"
  echo ""
  exit 0
else
  echo "❌ Some prerequisites missing. Please install them first."
  echo ""
  exit 1
fi

