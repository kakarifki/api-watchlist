# syntax=docker/dockerfile:1
FROM oven/bun:1 as base
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

RUN bunx prisma generate && bunx prisma migrate deploy

EXPOSE 3000
ENV PORT=3000 NODE_ENV=production
CMD ["bun", "run", "src/index.ts"]


