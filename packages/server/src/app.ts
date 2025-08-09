import "dotenv/config";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express, { Express, ErrorRequestHandler } from "express";
import morgan from "morgan";
import router from "./routes/index";
import { configJwt, configLocal } from "./config/passport";
import passport from "passport";
import { Prisma } from "@game-forge/prisma/generated/prisma";
import compression from "compression";

const app: Express = express();

export const corsOptions: CorsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    process.env.CLIENT_URL,
  ],
  credentials: true,
  allowedHeaders: ["Content-type"],
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

configLocal();
configJwt();

app.use(passport.initialize());
app.use(router);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.log(err);
  if (err.name === "AuthenticationError") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      console.log("handling");
      const target = err.meta?.target;

      const fields =
        Array.isArray(target) && target.every((t) => typeof t === "string")
          ? target.join(", ")
          : "field";

      res.status(409).json({
        message: `A record with this ${fields} already exists.`,
      });
      return;
    }
  }

  res
    .status(err.code || 500)
    .json({ message: err.message || "Internal Server Error" });
};

app.use(errorHandler);

export { app };
