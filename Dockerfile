# Stage 1: Build the application
FROM node:18 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Run the application
FROM node:18

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy build output and necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose the default port
EXPOSE 3000

# Run the application
CMD ["node", "dist/main"]
