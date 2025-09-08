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
        res.status(400).json({ message: "no collection exists with id" });
        return;
      }

      const user = req.user as User;
      if (collection.userId !== user.id) {
        res.status(401).json({ message: "can't edit other users collections" });
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
};

export default CollectionRoutes;
