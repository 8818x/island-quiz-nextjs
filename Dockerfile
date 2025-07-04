FROM node:22-alpine AS deps

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY package*.json ./

RUN npm ci

FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build

RUN npx prisma generate

FROM node:22-alpine AS release

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]