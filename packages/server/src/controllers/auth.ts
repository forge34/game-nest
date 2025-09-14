import { NextFunction, Request, Response, CookieOptions } from "express";
import { body, oneOf, validationResult } from "express-validator";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import { User } from "@game-forge/prisma/generated/";
import jwt from "jsonwebtoken";
import passport from "passport";
import rateLimit from "express-rate-limit";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 1000 * 60 * 60 * 24 * 7,
  path: "/",
};

const nameValidation = (field: string) =>
  body(field)
    .trim()
    .isLength({ min: 1 })
    .withMessage(`${field} length too short`)
    .isAlphanumeric()
    .withMessage("Spaces aren't allowed in username")
    .escape();

const AuthRoute = {
  signup: [
    nameValidation("username"),
    body("email").isEmail(),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password should be at least 8 characters")
      .escape(),
    body("confirmPassword")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password should be at least 8 characters")
      .custom((value, { req }) => {
        return value === req.body.password;
      })
      .escape(),
    async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res
          .status(400)
          .json({ message: "create account field", errors: errors.array() });
        return;
      }
      const password = await bcrypt.hash(req.body.password, 10);
      await prisma.user.create({
        data: {
          name: req.body.username,
          password: password,
          email: req.body.email,
        },
      });

      res.status(200).json({ message: "user created" });
    },
  ],

  login: [
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      message: "Too many login attempts, try again later.",
    }),
    oneOf([nameValidation("username"), body("email").isEmail()]),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password should be at least 8 characters")
      .escape(),
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        next();
      } else {
        console.log("passed local");
        res.status(401).json({ errors: errors.array() });
      }
    },
    async (req: Request, res: Response, next: NextFunction) => {
      passport.authenticate(
        "local",
        { session: false },
        (err: any, user: any, info?: { message: string }) => {
          if (err) {
            return next(err);
          }

          if (!user) {
            res.status(401).json(info);
          } else {
            const currentUser = user as User;
            const token = jwt.sign({ id: currentUser.id }, process.env.SECRET, {
              expiresIn: "3d",
            });
            res.cookie("jwt", token, cookieOptions);
            res.status(200).json({ data: user, message: "login success" });
          }
        },
      )(req, res, next);
    },
  ],
};

export default AuthRoute;
