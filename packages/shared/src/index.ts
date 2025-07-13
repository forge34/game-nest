export * from "./prisma-types.js";

export const gameIncludes = {
  coverImage: true,
  genres: true,
  platforms: true,
  parent_game: true,
  reviews: true,
  screenshots: true,
  ageRating: true,
  developer: true,
  publisher: true,
  artworks: true,
} as const;

export const sortOptions = [
  { label: "A - Z", value: "az" },
  { label: "Z - A", value: "za" },
  { label: "Release date", value: "rel_date" },
  { label: "Rating", value: "rating" },
] as const;

export type SortOptions = (typeof sortOptions)[number]["value"];

export type FilterState = {
  genres: string[];
  platforms: string[];
  sort: string;
};

