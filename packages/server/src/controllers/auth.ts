import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import prisma from "../config/prisma";
import bcrypt from "bcryptjs";

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
};

export default Auth
