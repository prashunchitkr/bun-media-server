# Bun Media Server

## Installing Dependencies

```sh
bun i
```

## Preparing Prisma

```sh
cd apps/api
bun prisma migrate dev
```

## Starting Dev Server

```sh
bun dev
```

Backend server should be running on port `3000` and the web app should be running on port `3001`.
