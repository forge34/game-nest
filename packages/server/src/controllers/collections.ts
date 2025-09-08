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
};

export default CollectionRoutes;
