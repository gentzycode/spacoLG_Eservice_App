# Use Node 22 for build
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json .npmrc ./

# Install dependencies with legacy peer deps
RUN npm install --legacy-peer-deps

# Copy source files
COPY . .

# Accept build arguments for environment variables
ARG VITE_BASE_URL
ARG VITE_ADMIN_BASE_URL
ARG VITE_FRONTEND_URL
ARG VITE_APP_NAME
ARG VITE_APP_ENV
ARG VITE_PAYSTACK_PUBLIC_KEY
ARG REACT_APP_PAYSTACK_PUBLIC_KEY
ARG NODE_ENV

# Set environment variables for build
ENV VITE_BASE_URL=$VITE_BASE_URL
ENV VITE_ADMIN_BASE_URL=$VITE_ADMIN_BASE_URL
ENV VITE_FRONTEND_URL=$VITE_FRONTEND_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_PAYSTACK_PUBLIC_KEY=$VITE_PAYSTACK_PUBLIC_KEY
ENV REACT_APP_PAYSTACK_PUBLIC_KEY=$REACT_APP_PAYSTACK_PUBLIC_KEY
ENV NODE_ENV=$NODE_ENV

# Build the application
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config for SPA routing
RUN echo 'server { \
    listen 8080; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
