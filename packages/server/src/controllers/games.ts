import { gameIncludes, mappedSort, SortOptions } from "@game-forge/shared";
import prisma from "../config/prisma";
import { Response, Request } from "express";
import { toArray } from "../utils";
import { Prisma } from "@game-forge/prisma/generated/prisma";

const GamesRoute = {
  findMany: async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const genre = toArray<string>(req.query.genre as string[]);
    const platform = toArray<string>(req.query.platform as string[]);
    const sort = (req.query.sort as SortOptions) || ("az" as const);
    const limit = Number(req.query.limit) || 15;
    const offset = (page - 1) * limit;
    const where: Prisma.GameWhereInput = {
      parent_game: null,
      genres: genre.length > 0 ? { some: { name: { in: genre } } } : undefined,
      platforms:
        platform.length > 0 ? { some: { name: { in: platform } } } : undefined,
    };

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        include: gameIncludes,
        skip: offset,
        take: limit,
        where,
        orderBy: mappedSort[sort],
      }),
      prisma.game.count({ where }),
    ]);

    res.status(200).json({ games, total });
  },

  findOneById: async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const game = await prisma.game.findFirst({
      where: {
        id: id,
      },
      include: gameIncludes,
    });

    res.status(200).json(game);
  },

  genresFindMany: async (req: Request, res: Response) => {
    const genres = await prisma.genre.findMany({
      select: {
        id: true,
        igdbId: true,
        name: true,
        slug: true,
        _count: {
          select: { games: true },
        },
      },
    });

    const simplified = genres.map((genre) => ({
      id: genre.id,
      igdbId: genre.igdbId,
      name: genre.name,
      slug: genre.slug,
      gameCount: genre._count.games,
    }));

    res.status(200).json(simplified);
  },

  platformFindMany: async (req: Request, res: Response) => {
    const platforms = await prisma.platform.findMany({
      select: {
        id: true,
        igdbId: true,
        name: true,
        slug: true,
        _count: {
          select: { games: true },
        },
      },
    });

    const simplified = platforms.map((platform) => ({
      id: platform.id,
      igdbId: platform.igdbId,
      name: platform.name,
      slug: platform.slug,
      gameCount: platform._count.games,
    }));

    res.status(200).json(simplified);
  },
};

export default GamesRoute;
