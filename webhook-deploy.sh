#!/bin/bash

# Webhook Deployment Script
# This script can be triggered by GitHub webhooks or manual calls
# Usage: curl -X POST http://your-server-ip:3001/deploy -H "Authorization: Bearer YOUR_WEBHOOK_SECRET"

set -e

# Configuration
WEBHOOK_SECRET="${WEBHOOK_SECRET:-your-webhook-secret-change-this}"
PROJECT_DIR="/home/igor/personal-site"
LOG_FILE="/var/log/webhook-deploy.log"

# Colors for logging
CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Logging function
log() {
    echo -e "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

log_success() {
    log "${GREEN}✅ $1${NC}"
}

log_error() {
    log "${RED}❌ $1${NC}"
}

log_info() {
    log "${CYAN}ℹ️  $1${NC}"
}

# Change to project directory
cd "$PROJECT_DIR" || {
    log_error "Failed to change to project directory: $PROJECT_DIR"
    exit 1
}

log_info "Starting webhook deployment..."

# Execute deployment
if ./deploy.sh >> "$LOG_FILE" 2>&1; then
    log_success "Deployment completed successfully"

    # Send notification (optional - you can add email/Slack notifications here)
    log_info "Deployment notification sent"

    exit 0
else
    log_error "Deployment failed"
    exit 1
fi