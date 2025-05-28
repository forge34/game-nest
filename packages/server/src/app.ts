import "dotenv/config";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express, { Express } from "express";
import morgan from "morgan";
import router from "./routes/index";

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

app.use(router);

export { app };
