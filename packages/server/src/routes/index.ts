import { Router } from "express";
import AuthRoute from "../controllers/auth";
import GamesRoute from "../controllers/games";
import UsersRoute from "../controllers/user";

const router = Router();

router.get("/", (_, res) => {
  res.json("Hello word");
});

router.post("/signup", AuthRoute.signup);
router.post("/login", AuthRoute.login);

router.get("/games", GamesRoute.findMany);
router.get("/games/:id", GamesRoute.findOneById)
router.get("/genres" , GamesRoute.genresFindMany)
router.get("/library",UsersRoute.findFavourties)
router.get("/me" ,UsersRoute.getMe)

router.post("/library" , UsersRoute.addTolibrary)
router.post("/library/:gameId" , UsersRoute.markAsFavourite)

export default router;
