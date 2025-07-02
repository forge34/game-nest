import "dotenv/config";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express, { Express, ErrorRequestHandler } from "express";
import morgan from "morgan";
import router from "./routes/index";
import { configJwt, configLocal } from "./config/passport";
import passport from "passport";

const app: Express = express();

export const corsOptions: CorsOptions = {
  origin: ["http://localhost:5173", process.env.CLIENT_URL],
  credentials: true,
  allowedHeaders: ["Content-type"],
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

configLocal();
configJwt();

app.use(passport.initialize());
app.use(router);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err.name === "AuthenticationError") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  res
    .status(err.code || 500)
    .json({ message: err.message || "Internal Server Error" });
};

app.use(errorHandler);

export { app };
