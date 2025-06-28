# Development setup for React Vite app

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY src/frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src/frontend/ ./

# Expose port 5173 (Vite default dev server port)
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]