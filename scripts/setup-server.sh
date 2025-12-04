#!/bin/bash

# =============================================================================
# Production Server Setup
# =============================================================================
# Run this ON YOUR SERVER (not locally) to set up a fresh Ubuntu droplet.
# 
# Usage:
#   1. SSH into your server: ssh root@YOUR_IP
#   2. Download and run: curl -sL https://raw.githubusercontent.com/YOUR_REPO/main/scripts/setup-server.sh | bash
#   Or copy this script and run it manually.
# =============================================================================

set -e

echo ""
echo "🖥️  Setting up production server..."
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "⚠️  This script should be run as root (or with sudo)"
  echo "   Run: sudo bash setup-server.sh"
  exit 1
fi

# Update system
echo "Step 1/5: Updating system packages..."
apt update && apt upgrade -y
echo "✅ System updated"
echo ""

# Install Node.js 20
echo "Step 2/5: Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
echo "✅ Node.js $(node -v) installed"
echo ""

# Install nginx
echo "Step 3/5: Installing nginx..."
apt install -y nginx
systemctl enable nginx
systemctl start nginx
echo "✅ nginx installed and running"
echo ""

# Install PM2
echo "Step 4/5: Installing PM2..."
npm install -g pm2
echo "✅ PM2 $(pm2 -v) installed"
echo ""

# Generate SSH key for GitHub
echo "Step 5/5: Generating deploy key..."
if [ ! -f ~/.ssh/id_ed25519 ]; then
  ssh-keygen -t ed25519 -C "deploy-key" -f ~/.ssh/id_ed25519 -N ""
  echo "✅ SSH key generated"
else
  echo "✅ SSH key already exists"
fi

# Create app directory
mkdir -p /var/www
echo "✅ Created /var/www directory"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Server setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Add this deploy key to GitHub:"
echo "   (Your Repo → Settings → Deploy keys → Add deploy key)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cat ~/.ssh/id_ed25519.pub
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "2. Clone your repo:"
echo "   cd /var/www"
echo "   git clone git@github.com:YOUR_USERNAME/YOUR_REPO.git app"
echo ""
echo "3. Continue with the deploy guide for environment setup"
echo ""

