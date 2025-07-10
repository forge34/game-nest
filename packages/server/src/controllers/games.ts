import prisma from "../config/prisma";
import { Response, Request } from "express";
import { gameIncludes } from "../types";

const GamesRoute = {
  findMany: async (req: Request, res: Response) => {
    const games = await prisma.game.findMany({
      include: gameIncludes,
    });

    res.status(200).json(games);
  },

  findOneById: async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const game = await prisma.game.findFirst({
      where: {
        igdbId: id,
      },
      include: gameIncludes,
    });

    res.status(200).json(game);
  },

  genresFindMany: async (req: Request, res: Response) => {
    const genres = await prisma.genre.findMany({
      include: {
        games: true,
      },
    });

    res.status(200).json(genres);
  },

  platformFindMany: async (req: Request, res: Response) => {
    const platforms = await prisma.platform.findMany({
      include: { games: true },
    });
    res.status(200).json(platforms)
  },
};

export default GamesRoute;
