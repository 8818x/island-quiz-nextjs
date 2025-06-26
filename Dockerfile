FROM node:22-alpine

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

COPY entrypoint.sh .

RUN chmod +x entrypoint.sh

COPY next.config.ts ./next/config.ts

EXPOSE 3000

CMD ["./entrypoint.sh"]