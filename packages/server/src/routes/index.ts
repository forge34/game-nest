import { Router } from "express";
import Auth from "../controllers/auth";
import GamesRoute from "../controllers/games";

const router = Router();

router.get("/", (req, res) => {
  res.json("Hello word");
});

router.post("/signup", Auth.signup);
router.post("/login", Auth.login);

router.get("/games", GamesRoute.getMany);

export default router;
