import { Request, Response } from "express";
import passport from "passport";
import prisma from "../config/prisma";
import { User } from "../../generated/prisma";

const UsersRoute = {
  findFavourties: [
    passport.authenticate("jwt", { session: false }),
    async (req: Request, res: Response) => {
      const { id } = req.user as User;

      const favourites = await prisma.user.findFirst({
        where: {
          id: id,
        },
        include: {
          favourites: true,
        },
      });

      res.status(200).json(favourites.favourites);
    },
  ],

  getMe: [
    passport.authenticate("jwt", { session: false }),
    async (req: Request, res: Response) => {
      const user = req.user as User;

      res.status(200).json(user);
    },
  ],
};

export default UsersRoute;
