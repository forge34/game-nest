import { Router } from "express";
import Auth from "../controllers/auth";
import GamesRoute from "../controllers/games";

const router = Router();

router.get("/", (_, res) => {
  res.json("Hello word");
});

router.post("/signup", Auth.signup);
router.post("/login", Auth.login);

router.get("/games", GamesRoute.findMany);
router.get("/games/:id", GamesRoute.findOneById)

export default router;
