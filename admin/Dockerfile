# Multi-stage Dockerfile for Strapi
FROM --platform=$BUILDPLATFORM node:18-alpine AS base


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

# Start server (development by default, production if NODE_ENV=production)
CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"production\" ]; then npm run build && npx strapi start; else npm run dev; fi"]

