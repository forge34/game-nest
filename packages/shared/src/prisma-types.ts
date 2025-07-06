import { Prisma } from "../../server/generated/prisma";

export type GamesAllIncluded = Prisma.GameGetPayload<{
  include: {
    coverImage: true;
    genres: true;
    platforms: true;
    parent_game: true;
    reviews: true;
    screenshots: true;
    ageRating: true;
    developer: true;
    publisher: true;
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
    library: true;
  };
}>;
