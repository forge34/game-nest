import { Prisma } from "../../server/generated/prisma";

export type GamesAllIncluded = Prisma.GameGetPayload<{
  include: {
    coverImage: true;
    genres: true;
    platforms: true;
    parent_game: true;
    companies: true;
  };
}>;
