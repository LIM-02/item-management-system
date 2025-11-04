# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# install deps
COPY package.json package-lock.json ./
RUN npm ci

# copy source & build
COPY . .
RUN npm run build

# Render sets PORT at runtime; next start will read it.
EXPOSE 3000
CMD ["npm", "run", "start"]
