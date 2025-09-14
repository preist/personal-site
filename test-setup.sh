#!/bin/bash

# Test Script for Production Setup
# This script verifies that the deployment configuration is correct

set -e

echo "🔍 Testing production setup..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m'

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Test 1: Check required files exist
echo "📁 Checking required files..."
files=(".env" "docker-compose.yml" "nginx.conf" "deploy.sh" "webhook-server.js")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        success "Found $file"
    else
        error "Missing $file"
        exit 1
    fi
done

# Test 2: Check permissions
echo -e "\n🔐 Checking permissions..."
scripts=("deploy.sh" "webhook-deploy.sh" "webhook-server.js")
for script in "${scripts[@]}"; do
    if [ -x "$script" ]; then
        success "$script is executable"
    else
        error "$script is not executable"
        chmod +x "$script"
        success "Fixed permissions for $script"
    fi
done

# Test 3: Verify nginx configuration
echo -e "\n🌐 Testing nginx configuration..."
if docker run --rm -v "$(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro" nginx:alpine nginx -t; then
    success "Nginx configuration is valid"
else
    error "Nginx configuration has errors"
    exit 1
fi

# Test 4: Check Docker Compose configuration
echo -e "\n🐳 Testing Docker Compose configuration..."
if docker-compose config > /dev/null; then
    success "Docker Compose configuration is valid"
else
    error "Docker Compose configuration has errors"
    exit 1
fi

# Test 5: Check environment variables
echo -e "\n🔧 Checking environment configuration..."
if grep -q "admin.igorputina.com" .env; then
    success "Production domains configured in .env"
else
    warning "Production domains not found in .env - check NEXT_PUBLIC_STRAPI_URL"
fi

# Test 6: Check if ports are available
echo -e "\n🚪 Checking port availability..."
if ! netstat -tuln | grep -q ":80 "; then
    success "Port 80 is available"
else
    warning "Port 80 is in use - make sure to stop other services"
fi

if ! netstat -tuln | grep -q ":443 "; then
    success "Port 443 is available"
else
    warning "Port 443 is in use"
fi

if ! netstat -tuln | grep -q ":3001 "; then
    success "Port 3001 is available for webhook server"
else
    warning "Port 3001 is in use"
fi

# Test 7: Check Git repository status
echo -e "\n📚 Checking Git repository..."
if git status > /dev/null 2>&1; then
    success "Git repository is initialized"

    if git remote -v | grep -q "origin"; then
        success "Git remote 'origin' is configured"
    else
        warning "Git remote 'origin' not configured - needed for GitHub Actions"
    fi
else
    error "Not a Git repository or Git not available"
fi

# Test 8: Check Node.js availability
echo -e "\n🟢 Checking Node.js..."
if command -v node &> /dev/null; then
    success "Node.js is available ($(node --version))"
else
    warning "Node.js not found - webhook server won't work"
fi

# Test 9: Check Docker availability
echo -e "\n🐋 Checking Docker..."
if command -v docker &> /dev/null && docker info > /dev/null 2>&1; then
    success "Docker is available and running"
else
    error "Docker is not available or not running"
    exit 1
fi

if command -v docker-compose &> /dev/null; then
    success "Docker Compose is available"
else
    error "Docker Compose is not available"
    exit 1
fi

echo -e "\n🎉 Setup test completed successfully!"
echo -e "\n📋 Next steps:"
echo "1. Update DNS records to point to this server"
echo "2. Generate secure keys for .env file"
echo "3. Set up GitHub repository secrets for automated deployment"
echo "4. Test deployment with: ./deploy.sh"
echo "5. Configure SSL certificates when ready"

echo -e "\n📖 See DEPLOYMENT.md for detailed instructions"