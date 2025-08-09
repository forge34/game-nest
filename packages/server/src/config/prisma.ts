import { PrismaClient } from "@game-forge/prisma/generated/prisma";

const databaseUrl =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
  omit: {
    user: {
      password: true,
    },
  },
});

export default prisma;
