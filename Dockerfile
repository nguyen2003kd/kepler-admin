# Multi-stage Dockerfile for Next.js application

# Stage 1: Base
FROM node:20-alpine AS base
WORKDIR /usr/src/app
FROM base AS deps
# Add libc6-compat for compatibility
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Stage 2: Builder
FROM base AS builder
WORKDIR /usr/src/app

# Copy dependencies from deps stage
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copy all source files
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Stage 3: Development
FROM base AS development
WORKDIR /usr/src/app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package files and install all dependencies (including dev)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Start development server
CMD ["npm", "run", "dev"]

# Stage 4: Production Runner
FROM base AS production
WORKDIR /usr/src/app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package files and production dependencies
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY package*.json ./

# Copy built application
COPY --from=builder /usr/src/app/.next ./.next

# Copy other necessary files
COPY next.config.mjs ./
COPY tsconfig.json ./
# Set environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Start production server
CMD ["npm", "run", "start"]
