# Island Quiz - Next.js App

A modern quiz platform built with Next.js, Prisma, PostgreSQL, and NextAuth.js.

Developed by Kanisorn Panichphol

---
## Installation

### 1. Clone the repo

```bash
git clone --branch develop https://github.com/8818x/island-quiz-nextjs.git
cd island-quiz-nextjs
```

### 2. Copy example environment

```bash
cp .env.example .env
```
Edit your .env file and fill in NEXTAUTH_SECRET with a strong random value.

You can quickly generate one using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as the value for NEXTAUTH_SECRET in your .env file:

```bash
NEXTAUTH_SECRET=your_generate_string
```

### 3. Install dependencies

```bash
npm ci
```

### 4. Run Docker services
```bash
docker compose up -d --build
```

### 5. Access the services

```bash
Nextjs - localhost:3000
pgAdmin - localhost:5050
```

### 6. Prisma Studio (Optional)

```bash
docker compose exec app npx prisma studio
```

### 7. If Docker didn't implement Prisma

```bash
docker compose exec app npx prisma db push
docker compose exec app npx prisma generate
```

### 8. Stop Docker services
```bash
docker compose down -v
```