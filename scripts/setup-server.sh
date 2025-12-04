#!/bin/bash
# =============================================================================
# Server Setup Script for DigitalOcean
# =============================================================================
#
# Run this on a fresh Ubuntu 22.04 droplet to set up everything needed
# for deploying your Next.js app.
#
# Usage: 
#   1. SSH into your server: ssh root@YOUR_IP
#   2. Run: curl -fsSL https://raw.githubusercontent.com/YOUR_USER/YOUR_REPO/main/scripts/setup-server.sh | bash
#   Or copy/paste this entire script into the terminal.
#
# =============================================================================

set -e  # Exit on any error

echo ""
echo "=========================================="
echo "  🚀 Server Setup for Next.js + PM2"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${GREEN}▶ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# =============================================================================
# IMPORTANT: Make everything non-interactive so users don't get stuck on dialogs
# =============================================================================
export DEBIAN_FRONTEND=noninteractive
export NEEDRESTART_MODE=a

# Fix any interrupted package manager state (common if previous run was interrupted)
print_step "Checking package manager state..."
if dpkg --audit 2>/dev/null | grep -q .; then
    print_warning "Fixing interrupted package manager..."
    dpkg --configure -a
fi

# Step 1: Update system (non-interactive, keep existing configs)
print_step "Updating system packages..."
apt-get update
apt-get -y -o Dpkg::Options::="--force-confold" -o Dpkg::Options::="--force-confdef" upgrade

# Step 2: Install Node.js 20
print_step "Installing Node.js 20..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "  Node.js already installed: $(node -v)"
fi

# Step 3: Install nginx
print_step "Installing nginx..."
apt-get install -y -o Dpkg::Options::="--force-confold" nginx
systemctl enable nginx
systemctl start nginx

# Step 4: Install PM2
print_step "Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
else
    echo "  PM2 already installed: $(pm2 -v)"
fi

# Step 5: Generate SSH key for GitHub deploy key
print_step "Setting up SSH key for GitHub..."
if [ ! -f ~/.ssh/id_ed25519 ]; then
    ssh-keygen -t ed25519 -C "deploy-key" -f ~/.ssh/id_ed25519 -N ""
    echo "  ✓ SSH key generated"
else
    echo "  SSH key already exists"
fi

# Step 6: Create app directory
print_step "Creating app directory..."
mkdir -p /var/www
chown -R root:root /var/www

# Step 7: Configure SSH for GitHub
print_step "Configuring SSH for GitHub..."
cat >> ~/.ssh/config << 'EOF'
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519
    StrictHostKeyChecking no
EOF

# Step 8: Install certbot for SSL
print_step "Installing certbot for SSL..."
apt-get install -y certbot python3-certbot-nginx

# Step 9: Configure firewall
print_step "Configuring firewall..."
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
echo "y" | ufw enable

echo ""
echo "=========================================="
echo -e "${GREEN}  ✅ Server setup complete!${NC}"
echo "=========================================="
echo ""
echo "📋 Your deploy key (copy this to GitHub):"
echo "----------------------------------------"
cat ~/.ssh/id_ed25519.pub
echo "----------------------------------------"
echo ""
echo "Next steps:"
echo "  1. Copy the key above"
echo "  2. Go to GitHub → Your Repo → Settings → Deploy keys"
echo "  3. Add the key with 'Allow write access' checked"
echo "  4. Continue with the deploy guide"
echo ""
