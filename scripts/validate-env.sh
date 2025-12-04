#!/bin/bash

# =============================================================================
# Environment Variable Validator
# =============================================================================
# Validates that all required environment variables are set.
# Run with: npm run setup:validate
# =============================================================================

echo ""
echo "🔍 Validating environment variables..."
echo ""

# Load .env.local if it exists
if [ -f ".env.local" ]; then
  export $(grep -v '^#' .env.local | grep -v '^$' | xargs 2>/dev/null)
else
  echo "❌ .env.local not found"
  echo "   Run: cp .env.example .env.local"
  exit 1
fi

errors=0
warnings=0

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Local Development (required):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Required for local development
if [ -n "$GOOGLE_CLIENT_ID" ] && [ "$GOOGLE_CLIENT_ID" != "your-client-id" ]; then
  echo "✅ GOOGLE_CLIENT_ID"
else
  echo "❌ GOOGLE_CLIENT_ID - Missing or placeholder"
  errors=1
fi

if [ -n "$GOOGLE_CLIENT_SECRET" ] && [ "$GOOGLE_CLIENT_SECRET" != "your-client-secret" ]; then
  echo "✅ GOOGLE_CLIENT_SECRET"
else
  echo "❌ GOOGLE_CLIENT_SECRET - Missing or placeholder"
  errors=1
fi

if [ -n "$ADMIN_EMAIL" ] && [ "$ADMIN_EMAIL" != "you@example.com" ]; then
  echo "✅ ADMIN_EMAIL = $ADMIN_EMAIL"
else
  echo "❌ ADMIN_EMAIL - Missing or placeholder"
  errors=1
fi

if [ -n "$ADMIN_NAME" ]; then
  echo "✅ ADMIN_NAME = $ADMIN_NAME"
else
  echo "⚠️  ADMIN_NAME - Optional, not set"
  warnings=1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Production (required for deployment):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$DATABASE_URL_PROD" ] && [[ "$DATABASE_URL_PROD" == postgresql://* ]]; then
  # Mask the password in output
  masked=$(echo "$DATABASE_URL_PROD" | sed 's/:\/\/[^:]*:[^@]*@/:\/\/***:***@/')
  echo "✅ DATABASE_URL_PROD = $masked"
else
  echo "⚠️  DATABASE_URL_PROD - Not set (needed for production)"
fi

if [ -n "$NEXTAUTH_SECRET" ] && [ ${#NEXTAUTH_SECRET} -ge 32 ]; then
  echo "✅ NEXTAUTH_SECRET (${#NEXTAUTH_SECRET} chars)"
else
  echo "⚠️  NEXTAUTH_SECRET - Not set or too short (needed for production)"
  echo "   Generate with: openssl rand -base64 32"
fi

if [ -n "$NEXT_PUBLIC_SITE_URL" ] && [[ "$NEXT_PUBLIC_SITE_URL" == https://* ]]; then
  echo "✅ NEXT_PUBLIC_SITE_URL = $NEXT_PUBLIC_SITE_URL"
else
  echo "⚠️  NEXT_PUBLIC_SITE_URL - Not set or not HTTPS (needed for production)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Mobile Testing (optional):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$NGROK_DOMAIN" ]; then
  echo "✅ NGROK_DOMAIN = $NGROK_DOMAIN"
else
  echo "⚪ NGROK_DOMAIN - Not set (optional)"
fi

if [ -n "$NGROK_OAUTH_EMAIL" ]; then
  echo "✅ NGROK_OAUTH_EMAIL = $NGROK_OAUTH_EMAIL"
else
  echo "⚪ NGROK_OAUTH_EMAIL - Not set (optional)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $errors -eq 0 ]; then
  echo "✅ All required variables set! Ready for local development."
  echo ""
  exit 0
else
  echo "❌ Missing required variables. Edit .env.local to fix."
  echo ""
  exit 1
fi

