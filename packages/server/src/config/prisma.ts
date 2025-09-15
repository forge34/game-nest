import { PrismaClient } from "@gridcollect/prisma";

const databaseUrl =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

const prisma: PrismaClient = new PrismaClient({
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
  // log: [{ emit: "stdout", level: "query" }],
});

export default prisma;
