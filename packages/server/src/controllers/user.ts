import { Request, Response } from "express";
import passport from "passport";
import prisma from "../config/prisma";
import { User } from "../../generated/prisma";
import { gameIncludes } from "@game-forge/shared";
import { body, validationResult } from "express-validator";

const maximumHours = 16000;

() => {};

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
          hoursPlayed: Math.round(Math.pow(Math.random(), 3) * maximumHours),
          completion: Math.floor(Math.random() * 101),
        },
      });
      res.status(200).json({ message: "Game added to library" });
    },
  ],
  updateLibraryGame: [
    passport.authenticate("jwt", { session: false }),
    body("status")
      .optional()
      .isIn(["Wishlist", "Playing", "Completed", "Backlog", "Dropped"]),
    body("rating").optional().isFloat({ min: 0, max: 10 }).toFloat(),
    body("favorite").optional().isBoolean().toBoolean(),
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res
          .status(400)
          .json({ errors: errors.array(), message: "Failed to update game" });
        return;
      }

      const gameId = Number(req.params.gameId);
      const { status, rating, favorite } = req.body;
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
        update: { status, rating, favorite },
        create: {
          userId: user.id,
          gameId: game.id,
          status: status ?? "Backlog",
          rating: rating ?? 0.0,
          favorite: favorite ?? false,
          hoursPlayed: Math.round(Math.pow(Math.random(), 3) * maximumHours),
          completion: Math.floor(Math.random() * 101),
        },
      });
      res.status(200).json({ message: "Library game info saved" });
    },
  ],
  reviewGame: [
    passport.authenticate("jwt", { session: false }),
    body("comment").trim().isLength({ min: 1 }).escape(),
    body("rating").optional().isFloat({ min: 0, max: 5 }).toFloat(),
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res
          .status(400)
          .json({ errors: errors.array(), message: "Failed to add review" });
        return;
      }

      const gameId = Number(req.params.gameId);
      const { rating, comment } = req.body;
      console.log(rating, comment);
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

      const review = await prisma.review.create({
        data: {
          userId: user.id,
          gameId: game.id,
          comment: comment,
        },
      });

      await prisma.game.update({
        where: {
          id: game.id,
        },
        data: {
          reviews: {
            connect: [
              {
                id: review.id,
                userId_gameId: {
                  gameId: game.id,
                  userId: user.id,
                },
              },
            ],
          },
        },
      });

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
          status: "Completed",
          rating: rating ?? 0.0,
          hoursPlayed: Math.round(Math.pow(Math.random(), 3) * maximumHours),
          completion: Math.floor(Math.random() * 101),
        },
      });

      res.status(200).json({ message: "Review added successfully" });
    },
  ],
};

export default UsersRoute;
