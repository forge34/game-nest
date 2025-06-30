import prisma from "../config/prisma";
import { Response, Request } from "express";

const GamesRoute = {
  findMany: async (req: Request, res: Response) => {
    const games = await prisma.game.findMany({
      include: {
        coverImage: true,
        genres: true,
      },
    });

    res.status(200).json(games);
  },

  findOneById: async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const game = await prisma.game.findFirst({
      where: {
        id: id,
      },
      include: {
        coverImage: true,
      },
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
};

export default GamesRoute;
