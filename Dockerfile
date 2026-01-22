FROM node:20-alpine AS builder
WORKDIR /app

# Build arguments
ARG NPM_TOKEN
ARG VITE_API_BASE_URL  # ← ADICIONE ESTA LINHA

# Set environment variable for Vite
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN echo "@igorguariroba:registry=https://npm.pkg.github.com" > .npmrc && \
    echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc
RUN npm ci
RUN rm -f .npmrc
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
