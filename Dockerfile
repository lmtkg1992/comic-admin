FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the application source
COPY . .

RUN npm run build

# Stage 2: Serve the static site with Nginx
FROM nginx:latest
WORKDIR /etc/nginx/conf.d

# Copy and replace DOMAIN_URL in the Nginx config
ARG ADMIN_DOMAIN_NAME
COPY nginx.conf.template default.conf.template
RUN sh -c "envsubst '\$ADMIN_DOMAIN_NAME' < default.conf.template > /etc/nginx/conf.d/default.conf"

# Copy the static site from the build stage
COPY --from=builder /app/out /usr/share/nginx/html

# Expose port 80 for web access
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]