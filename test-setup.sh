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
files=(".env" "docker-compose.yml")
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
if [ -f "test-setup.sh" ]; then
    if [ -x "test-setup.sh" ]; then
        success "test-setup.sh is executable"
    else
        warning "test-setup.sh is not executable"
        chmod +x "test-setup.sh"
        success "Fixed permissions for test-setup.sh"
    fi
fi

# Test 3: Check Docker Compose configuration
echo -e "\n🐳 Testing Docker Compose configuration..."
if docker compose config > /dev/null; then
    success "Docker Compose configuration is valid"
else
    error "Docker Compose configuration has errors"
    exit 1
fi

# Test 4: Check environment variables
echo -e "\n🔧 Checking environment configuration..."
if [ -f ".env" ] && grep -q "NEXT_PUBLIC_STRAPI_URL" .env; then
    success "Strapi URL configured in .env"
else
    warning "NEXT_PUBLIC_STRAPI_URL not found in .env - check configuration"
fi

# Test 5: Check if ports are available
echo -e "\n🚪 Checking port availability..."
if ! netstat -tuln 2>/dev/null | grep -q ":3000 "; then
    success "Port 3000 is available for Next.js"
else
    warning "Port 3000 is in use"
fi

if ! netstat -tuln 2>/dev/null | grep -q ":1337 "; then
    success "Port 1337 is available for Strapi"
else
    warning "Port 1337 is in use"
fi

# Test 6: Check Git repository status
echo -e "\n📚 Checking Git repository..."
if git status > /dev/null 2>&1; then
    success "Git repository is initialized"
else
    warning "Not a Git repository or Git not available"
fi

# Test 7: Check Node.js availability
echo -e "\n🟢 Checking Node.js..."
if command -v node &> /dev/null; then
    success "Node.js is available ($(node --version))"
else
    warning "Node.js not found - webhook server won't work"
fi

# Test 8: Check Docker availability
echo -e "\n🐋 Checking Docker..."
if command -v docker &> /dev/null && docker info > /dev/null 2>&1; then
    success "Docker is available and running"
else
    error "Docker is not available or not running"
    exit 1
fi

if command -v docker &> /dev/null && docker compose version &> /dev/null; then
    success "Docker Compose is available"
else
    error "Docker Compose is not available"
    exit 1
fi

echo -e "\n🎉 Setup test completed successfully!"
echo -e "\n📋 Next steps:"
echo "1. Generate secure keys for .env file"
echo "2. Test development environment with: make dev"
echo "3. Test production environment with: make prod"
echo "4. Configure external nginx proxy if needed"

echo -e "\n📖 Run 'make help' for available commands"