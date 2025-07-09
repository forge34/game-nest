import { Request, Response } from "express";
import passport from "passport";
import prisma from "../config/prisma";
import { User } from "../../generated/prisma";

const UsersRoute = {
  findFavourties: [
    passport.authenticate("jwt", { session: false }),
    async (req: Request, res: Response) => {
      const { id } = req.user as User;

      const library = await prisma.user.findFirst({
        where: {
          id: id,
        },
        include: {
          library: {
            include: {
              game: true,
            },
          },
        },
      });

      res.status(200).json(library.library);
    },
  ],

  getMe: [
    passport.authenticate("jwt", { session: false }),
    async (req: Request, res: Response) => {
      const user = req.user as User;

      res.status(200).json(user);
    },
  ],

  addTolibrary: [
    passport.authenticate("jwt", { session: false }),
    async (req: Request, res: Response) => {
      const gameId = Number(req.body.gameId);
      const user = req.user as User;

      if (!gameId) {
        res.status(400).json({ message: "Missing or invalid gameId" });
        return;
      }

      const game = await prisma.game.findFirst({
        where: { igdbId: gameId },
      });

      if (!game) {
        res.status(404).json({ message: "Game not found" });
        return;
      }

      await prisma.userGame.upsert({
        where: {
          userId_gameId: {
            userId: user.id,
            gameId: game.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          gameId: game.id,
          status: "Backlog",
        },
      });
      res.status(200).json({ message: "Game added to library" });
    },
  ],
};

export default UsersRoute;
