import { Router } from "express";
import Auth from "../controllers/auth";

const router = Router();

router.get("/", (req, res) => {
  res.json("Hello word");
});

router.post("/signup", Auth.signup);
router.post("/login", Auth.login);

export default router;
