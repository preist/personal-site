#!/bin/bash

# Personal Website Deployment Script
# This script handles production deployment on the DigitalOcean droplet

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Colors for output
CYAN='\033[0;36m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${CYAN}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml not found. Make sure you're in the project root directory."
    exit 1
fi

# Pull latest changes from git
print_status "Pulling latest changes from Git..."
git fetch origin main
git reset --hard origin/main
print_success "Git repository updated"

# Stop existing containers
print_status "Stopping existing containers..."
make stop 2>/dev/null || true
print_success "Containers stopped"

# Clean up old containers and images (but preserve data)
print_status "Cleaning up old containers and images..."
docker system prune -f
print_success "Cleanup completed"

# Generate Strapi types (if the command is available)
if command -v node &> /dev/null; then
    print_status "Generating Strapi TypeScript types..."
    make types 2>/dev/null || print_warning "Type generation skipped (dependencies not ready)"
fi

# Build and start production environment
print_status "Building and starting production environment..."
make prod

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 30

# Check if services are running
print_status "Checking service health..."
if docker-compose --profile prod ps | grep -q "Up"; then
    print_success "Services are running!"

    print_success "🎉 Deployment completed successfully!"
    print_status "Frontend: http://www.igorputina.com"
    print_status "Strapi Admin: http://admin.igorputina.com"

    # Show container status
    print_status "Container status:"
    make status
else
    print_error "Some services failed to start. Check logs with: make logs"
    exit 1
fi

echo ""
print_status "Deployment logs can be viewed with: make logs"
print_status "To stop all services: make stop"