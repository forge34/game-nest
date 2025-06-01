import prisma from "../config/prisma";
import { Response, Request } from "express";

const GamesRoute = {
  findMany: async (req: Request, res: Response) => {
    const games = await prisma.game.findMany();

    res.status(200).json(games);
  },

  findOneById: async (req:Request,res:Response) => {
    const id = parseInt(req.params.id)
    const game = await prisma.game.findFirst({
      where:{
        id:id
      }
    })

    res.status(200).json(game)
  }
};

export default GamesRoute
