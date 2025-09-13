import passport from "passport";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { gameIncludes, User } from "@game-forge/shared";
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
    body("name").optional().trim().escape(),
    body("description").optional({ checkFalsy: true }).trim().escape(),

    async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({
          errors: errors.array(),
          message: "Failed to create collection",
        });
        return;
      }
      const collectionId = parseInt(req.params.id);

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
      const collectionId = parseInt(req.params.id);
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
      const collectionId = parseInt(req.params.id);

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

      const gameId = parseInt(req.params.gameId);

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
  removeGameFromCollection: [
    passport.authenticate("jwt", { session: false }),
    async (req: Request, res: Response) => {
      const collectionId = parseInt(req.params.id);
      const gameId = parseInt(req.params.gameId);
      const user = req.user as User;

      if (isNaN(collectionId) || isNaN(gameId)) {
        return res.status(400).json({ message: "invalid ids" });
      }

      const collection = await prisma.collection.findUnique({
        where: { id: collectionId },
      });

      if (!collection) {
        res.status(404).json({ message: "collection not found" });
        return;
      }
      if (collection.userId !== user.id) {
        res.status(403).json({ message: "forbidden" });
        return;
      }

      const game = await prisma.game.findUnique({
        where: { id: gameId },
      });

      if (!game) {
        res.status(404).json({ message: "game not found" });
        return;
      }

      const collectionGame = await prisma.collectionGame.findUnique({
        where: {
          collectionId_gameId: { collectionId, gameId },
        },
      });

      if (!collectionGame) {
        res.status(404).json({ message: "game not in collection" });
        return;
      }

      await prisma.collectionGame.delete({
        where: {
          collectionId_gameId: {
            gameId: collectionGame.gameId,
            collectionId: collectionGame.collectionId,
          },
        },
      });

      return res.status(200).json({ message: "game removed successfully" });
    },
  ],
  findCollectionById: [
    async (req: Request, res: Response) => {
      const collectionId = parseInt(req.params.id);
      if (isNaN(collectionId)) {
        return res.status(400).json({ message: "Invalid collection id" });
      }

      const collection = await prisma.collection.findFirst({
        where: {
          id: collectionId,
        },
        include: {
          user: true,
          games: {
            include: {
              game: {
                include: gameIncludes,
              },
            },
          },
        },
      });

      if (!collection) {
        res.status(404).json({ message: "no collection exists with id" });
        return;
      }

      res
        .status(200)
        .json({ ...collection, games: collection.games.map((g) => g.game) });
    },
  ],
  getAllCollections: [
    async (req: Request, res: Response) => {
      const limit = Number(req.query.limit) || 15;
      const page = Number(req.query.page) || 1;

      const collections = await prisma.collection.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          games: {
            include: {
              game: { include: gameIncludes },
            },
          },
          user: true,
        },
      });

      const count = await prisma.collection.count();

      const formatted = collections.map((c) => ({
        ...c,
        games: c.games.map((g) => g.game),
      }));
      res.status(200).json({ collections: formatted, count });
    },
  ],
};

export default CollectionRoutes;
