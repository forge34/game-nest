import passport from "passport";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { User } from "@game-forge/shared";
import prisma from "../config/prisma";

const CollectionRoutes = {
  createCollection: [
    passport.authenticate("jwt", { session: false }),
    body("name").trim().isLength({ min: 5 }).escape(),
    body("description")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ min: 1 })
      .escape(),
    async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({
          errors: errors.array(),
          message: "Failed to create collection",
        });
        return;
      }

      const name = req.body.name;
      const description = req.body.description ? req.body.description : null;
      const user = req.user as User;

      const collection = await prisma.collection.create({
        data: {
          userId: user.id,

          name,
          description,
        },
      });

      res.status(201).json(collection);
    },
  ],
  updateCollection: [
    passport.authenticate("jwt", { session: false }),
    body("name").optional().trim().isLength({ min: 5 }).escape(),
    body("description")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ min: 1 })
      .escape(),

    async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({
          errors: errors.array(),
          message: "Failed to create collection",
        });
        return;
      }
      const collectionId = Number(req.params.id);

      if (isNaN(collectionId)) {
        res.status(400).json({ message: "invalid collection id" });
        return;
      }
      const name = req.body.name;
      const description = req.body.description ? req.body.description : null;

      const collection = await prisma.collection.findFirst({
        where: {
          id: collectionId,
        },
      });

      if (!collection) {
        res.status(404).json({ message: "no collection exists with id" });
        return;
      }

      const user = req.user as User;
      if (collection.userId !== user.id) {
        res.status(403).json({ message: "can't edit other users collections" });
        return;
      }

      const updatedCollection = await prisma.collection.update({
        where: {
          id: collection.id,
        },
        data: {
          name: name ?? undefined,
          description: description ?? undefined,
        },
      });

      res.status(200).json(updatedCollection);
    },
  ],

  deleteCollection: [
    passport.authenticate("jwt", { session: false }),
    async (req: Request, res: Response) => {
      const collectionId = Number(req.params.id);
      if (isNaN(collectionId)) {
        return res.status(400).json({ message: "Invalid collection id" });
      }

      const user = req.user as User;

      const deletedCollection = await prisma.collection.deleteMany({
        where: {
          id: collectionId,
          userId: user.id,
        },
      });

      if (deletedCollection.count === 0) {
        return res
          .status(404)
          .json({ message: "Collection not found or not owned by you" });
      }

      return res
        .status(200)
        .json({ message: "Collection deleted successfully" });
    },
  ],
  addGameToCollection: [
    passport.authenticate("jwt", { session: false }),
    async (req: Request, res: Response) => {
      const collectionId = Number(req.params.id);

      if (isNaN(collectionId)) {
        res.status(400).json({ message: "invalid collection id" });
        return;
      }

      const collection = await prisma.collection.findFirst({
        where: {
          id: collectionId,
        },
      });

      if (!collection) {
        res.status(404).json({ message: "no collection exists with id" });
        return;
      }

      const user = req.user as User;
      if (collection.userId !== user.id) {
        res
          .status(403)
          .json({ message: "can't add games to other users collections" });
        return;
      }

      const gameId = Number(req.params.gameId);

      if (isNaN(gameId)) {
        res.status(400).json({ message: "invalid game id" });
        return;
      }

      const game = await prisma.game.findUnique({
        where: { id: gameId },
      });
      if (!game) {
        res.status(404).json({ message: "game not found" });
        return;
      }

      await prisma.collection.update({
        where: {
          id: collectionId,
          userId: user.id,
        },
        data: {
          games: {
            connectOrCreate: {
              where: {
                collectionId_gameId: { gameId, collectionId },
              },
              create: {
                gameId: gameId,
              },
            },
          },
        },
      });

      return res
        .status(200)
        .json({ message: "game added to collection successfully" });
    },
  ],
};

export default CollectionRoutes;
