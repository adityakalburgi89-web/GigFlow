FROM node:20-alpine AS builder

WORKDIR /app

# Accept VITE_API_URL during build (Issue 5)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

# Copy custom nginx config for SPA routing and CSP (Issue 1 & 12)
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
