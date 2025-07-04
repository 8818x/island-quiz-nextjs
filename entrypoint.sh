set -e

npx prisma generate

if [ "$NODE_ENV" = "development" ]; then
  npx prisma db push
  exec npm run dev
else
  npx prisma migrate deploy
  exec npm run start
fi