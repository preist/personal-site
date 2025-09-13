# Multi-stage Dockerfile for Strapi
FROM --platform=$BUILDPLATFORM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM base AS development
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Create uploads directory and set permissions
RUN mkdir -p public/uploads && chmod 755 public/uploads

# Expose port
EXPOSE 1337

# Start development server
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM base AS production
WORKDIR /app

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public

# Ensure uploads directory exists and has proper permissions
RUN mkdir -p public/uploads && chmod 755 public/uploads

# Create non-root user
RUN addgroup --system --gid 1001 strapi
RUN adduser --system --uid 1001 strapi
USER strapi

# Expose port
EXPOSE 1337

# Start production server
CMD ["npm", "start"]