# Dockerfile (Unified for Dev and Prod)
# This Dockerfile defines four stages: deps, development, builder, and release.

# Stage 1: Install shared dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Development image
FROM deps AS development
# Set development environment variable
ENV NODE_ENV=development
WORKDIR /app
COPY . .
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh
# Expose ports for Next.js dev server and Prisma Studio
EXPOSE 3000 5555
# Entrypoint will handle prisma generate, db push, and start dev server
CMD ["./entrypoint.sh"]

# Stage 3: Builder for production
FROM deps AS builder
WORKDIR /app
COPY . .
# Build Next.js and generate Prisma client
RUN npm run build
RUN npx prisma generate

# Stage 4: Production release image
FROM node:22-alpine AS release
RUN apk add --no-cache libc6-compat
WORKDIR /app
# Copy only production artifacts
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh
# Set production environment
ENV NODE_ENV=production
EXPOSE 3000
# Entrypoint will handle migrations and start the production server
ENTRYPOINT ["./entrypoint.sh"]