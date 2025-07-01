import { Prisma } from "../../server/generated/prisma";

export type GamesAllIncluded = Prisma.GameGetPayload<{
  include: {
    coverImage: true;
    genres: true;
    platforms: true;
    parent_game: true;
    companies: true;
    reviews: true;
  };
}>;

export type GenresWithGames = Prisma.GenreGetPayload<{
  include: {
    games: true;
  };
}>;

export type User = Prisma.UserGetPayload<{
  include: {
    reviews: true;
    favourites: true;
  };
}>;
