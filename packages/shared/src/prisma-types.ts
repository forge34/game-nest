import { gameIncludes, SortOptions } from "./constants";
import type { Prisma } from "@game-forge/prisma/generated/prisma";

export type Game = Prisma.GameGetPayload<{
  include: typeof gameIncludes;
}>;

export type Genre = Prisma.GenreGetPayload<{}> & { gameCount: number };

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

export type Review = Prisma.ReviewGetPayload<{
  include: {
    user: true;
  };
}>;

export type UserGame = Prisma.UserGameGetPayload<{
  include: {
    user: true;
  };
}>;

export type Platform = Prisma.PlatformGetPayload<{}> & { gameCount: number };
