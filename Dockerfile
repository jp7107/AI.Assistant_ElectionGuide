# ── Stage 1: Build React client ──
FROM node:18-alpine AS client-build

WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --production=false
COPY client/ ./
RUN npm run build

# ── Stage 2: Production server ──
FROM node:18-alpine

WORKDIR /app

# Copy server
COPY server/package*.json ./server/
RUN cd server && npm ci --production

COPY server/ ./server/

# Copy built client
COPY --from=client-build /app/client/dist ./client/dist

EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080

CMD ["node", "server/index.js"]
