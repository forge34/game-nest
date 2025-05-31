import { NextFunction, Request, Response, CookieOptions } from "express";
import expressAsyncHandler from "express-async-handler";
import { body, oneOf, validationResult } from "express-validator";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import { User } from "../../generated/prisma";
import jwt from "jsonwebtoken";
import passport from "passport";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 1000 * 60 * 60 * 24 * 7,
  path: "/",
};

const nameValidation = (field: string) =>
  body(field)
    .trim()
    .isLength({ min: 1 })
    .withMessage(`${field} length too short`)
    .escape();

const Auth = {
  signup: [
    nameValidation("name"),
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
    expressAsyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
          bcrypt.hash(req.body.password, 10, async (err, hash) => {
            if (!err) {
              await prisma.user.create({
                data: {
                  name: req.body.name,
                  password: hash,
                  email: req.body.email,
                },
              });

              res.status(200).json("user created");
            } else {
              res.status(500).json({ message: "Internal server error" });
            }
          });
        } else {
          res.status(401).json({ errors: errors.array() });
        }
      },
    ),
  ],

  login: [
    oneOf([nameValidation("username"), body("email").isEmail()]),
    body("password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password should be at least 8 characters")
      .escape(),
    expressAsyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
          next();
        } else {
          console.log("passed local");
          res.status(401).json({ errors: errors.array() });
        }
      },
    ),
    expressAsyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate(
          "local",
          { session: false },
          (err: any, user: any, info?: { message: string }) => {
            console.log(info);

            if (err) {
              return next(err);
            }

            if (!user) {
              res.status(401).json(info);
            } else {
              res.status(200).json("login successs");
            }
          },
        )(req, res, next);
      },
    ),
  ],
};

export default Auth;
