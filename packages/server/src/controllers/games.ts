import prisma from "../config/prisma";
import { Response, Request } from "express";

const GamesRoute = {
  getMany: async (req: Request, res: Response) => {
    const games = await prisma.game.findMany();

    res.status(200).json(games);
  },
};

export default GamesRoute
