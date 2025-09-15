import { Router } from "express";
import AuthRoute from "../controllers/auth";
import GamesRoute from "../controllers/games";
import UsersRoute from "../controllers/user";
import CollectionRoutes from "../controllers/collections";

const router : Router = Router();

router.get("/", (_, res) => {
  res.json("Hello word");
});

router.post("/signup", AuthRoute.signup);
router.post("/login", AuthRoute.login);
router.get("/me", UsersRoute.getMe);

router.get("/games", GamesRoute.findMany);
router.get("/games/search" ,GamesRoute.searchGame)
router.get("/games/:id", GamesRoute.findOneById);
router.get("/genres", GamesRoute.genresFindMany);
router.get("/platforms", GamesRoute.platformFindMany);

router.get("/library", UsersRoute.findFavourties);
router.post("/library", UsersRoute.addTolibrary);
router.put("/library/:gameId", UsersRoute.updateLibraryGame);
router.put("/users/update_profile", UsersRoute.updateProfileImg);

router.post("/reviews/:gameId", UsersRoute.reviewGame);

router.get("/users/:id/collections", UsersRoute.getUserCollections);
router.get("/users/:name", UsersRoute.findUserById);
router.post("/collections", CollectionRoutes.createCollection);
router.get("/collections", CollectionRoutes.getAllCollections);
router.put("/collections/:id", CollectionRoutes.updateCollection);
router.delete("/collections/:id", CollectionRoutes.deleteCollection);
router.get("/collections/:id", CollectionRoutes.findCollectionById);
router.post(
  "/collections/:id/games/:gameId",
  CollectionRoutes.addGameToCollection,
);
router.delete(
  "/collections/:id/games/:gameId",
  CollectionRoutes.removeGameFromCollection,
);
export default router;
