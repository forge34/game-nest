import "dotenv/config";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express, { Express, ErrorRequestHandler } from "express";
import morgan from "morgan";
import router from "./routes/index";
import { configJwt, configLocal } from "./config/passport";
import passport from "passport";
import compression from "compression";
import rateLimit from "express-rate-limit";

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

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(apiLimiter);

configLocal();
configJwt();

app.use(passport.initialize());
app.use(router);

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);

  if (err.name === "AuthenticationError") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (err.code === "P2002") {
    return res.status(409).json({ message: "Duplicate entry" });
  }

  if (err.code === "P2025") {
    return res.status(404).json({ message: "Record not found" });
  }

  const isDev = process.env.NODE_ENV !== "production";
  res.status(500).json({
    message: isDev ? err.message : "Internal Server Error",
  });
};

app.use(errorHandler);

export { app };
