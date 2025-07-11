import { Request, Response } from "express";
import passport from "passport";
import prisma from "../config/prisma";
import { User } from "../../generated/prisma";
import { gameIncludes } from "@game-forge/shared";

const UsersRoute = {
  findFavourties: [
    passport.authenticate("jwt", { session: false }),
    async (req: Request, res: Response) => {
      const { id } = req.user as User;

      const library = await prisma.userGame.findMany({
        where: {
          userId: id,
        },
        include: {
          game: {
            include: gameIncludes,
          },
        },
      });

      res.status(200).json(library);
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
  markAsFavourite: [
    passport.authenticate("jwt", { session: false }),
    async (req: Request, res: Response) => {
      const gameId = Number(req.params.gameId);
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
        update: {
          favorite: true,
        },
        create: {
          userId: user.id,
          gameId: game.id,
          favorite: true,
          status: "Backlog",
        },
      });
      res.status(200).json({ message: "Game marked as favourite" });
    },
  ],
};

export default UsersRoute;
