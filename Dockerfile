# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies (only production and development dependencies)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run the application
FROM node:22-alpine

WORKDIR /app
COPY .credentials/firebase-admin.json .credentials/firebase-admin.json

# Install only production dependencies
COPY package*.json ./
RUN npm install --production --legacy-peer-deps

# Copy the built application and node_modules from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose the default port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]
