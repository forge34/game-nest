import { Prisma } from "../../server/generated/prisma";

export type Game = Prisma.GameGetPayload<{
  include: typeof gameIncludes;
}>;

export type GenresWithGames = Prisma.GenreGetPayload<{
  include: {
    games: true;
  };
}>;

export type User = Prisma.UserGetPayload<{
  include: {
    reviews: true;
    library: true;
  };
}>;

export type Library = Prisma.UserGameGetPayload<{
  include: {
    game: { include: typeof gameIncludes };
  };
}>[];

export type PlatformWithGames = Prisma.PlatformGetPayload<{
  include: {
    games: true;
  };
}>;


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
