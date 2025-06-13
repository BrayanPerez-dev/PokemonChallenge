# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# We copy dependency files
COPY package*.json .
RUN npm ci

# We copy all the code and build production
COPY . .
RUN npm run build

# Step 2: Server with NGINX
FROM nginx:stable-alpine AS production

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy the Angular build
COPY --from=builder /app/dist/pokemon-challenge/browser  /usr/share/nginx/html/

# Copy custom nginx configuration (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Server launch
CMD ["nginx", "-g", "daemon off;"]
