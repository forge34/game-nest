export * from "./prisma-types.js";
import type { Prisma } from "@game-forge/prisma/generated/client";

export const gameIncludes = {
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
} as const satisfies Prisma.GameInclude;

export const sortOptions = [
  { label: "A - Z", value: "az" },
  { label: "Z - A", value: "za" },
  { label: "Release date", value: "rel_date" },
  { label: "Rating", value: "rating" },
] as const;

export type SortOptions = (typeof sortOptions)[number]["value"];

export const mappedSort = {
  za: { title: "desc" },
  az: { title: "asc" },
  rel_date: { title: "desc" },
  rating: { rating: "desc" },
} as const satisfies Record<SortOptions, Prisma.GameFindManyArgs["orderBy"]>;
