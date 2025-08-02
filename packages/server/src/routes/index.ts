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
router.get("/me", UsersRoute.getMe);

router.get("/games", GamesRoute.findMany);
router.get("/games/:id", GamesRoute.findOneById);
router.get("/genres", GamesRoute.genresFindMany);
router.get("/platforms", GamesRoute.platformFindMany);

router.get("/library", UsersRoute.findFavourties);
router.post("/library", UsersRoute.addTolibrary);
router.put("/library/:gameId", UsersRoute.updateLibraryGame);


router.post("/reviews/:gameId",UsersRoute.reviewGame)
export default router;
