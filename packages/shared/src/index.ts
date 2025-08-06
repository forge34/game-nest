import { z } from "zod";
export * from "./prisma-types.js";
import { Prisma } from "../../server/generated/prisma";

export const gameIncludes: Prisma.GameInclude = {
  coverImage: true,
  genres: true,
  platforms: true,
  parent_game: true,
  reviews: {
    include: {
      user: true,
    },
  },
  screenshots: true,
  ageRating: true,
  developer: true,
  publisher: true,
  artworks: true,
  userGames: {
    include: {
      user: true,
    },
  },
} as const;

export const sortOptions = [
  { label: "A - Z", value: "az" },
  { label: "Z - A", value: "za" },
  { label: "Release date", value: "rel_date" },
  { label: "Rating", value: "rating" },
] as const;

export type SortOptions = (typeof sortOptions)[number]["value"];

export const filterStateSchema = z.object({
  page: z.coerce.number().default(1),
  genres: z.array(z.string()).default([]),
  platforms: z.array(z.string()).default([]),
  sort: z.enum(["az", "za", "rel_date", "rating"]).default("rating"),
});

export type FilterState = z.infer<typeof filterStateSchema>;
