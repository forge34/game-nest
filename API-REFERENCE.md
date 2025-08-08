# API Documentation

This document describes the API endpoints implemented in the `packages/server/src/routes/` and `packages/server/src/controllers/` directories.

## Authentication

### POST `/signup`
- **Description**: Create a new user account.
- **Body**:
  - `username`: string (required)
  - `email`: string (required, valid email)
  - `password`: string (required, min 8 chars)
  - `confirmPassword`: string (required, must match `password`)
- **Response**: `{ message: "user created" }`
- **Validation**: Returns 400 if validation fails.

### POST `/login`
- **Description**: Authenticate a user.
- **Body**:
  - Either `username` or `email`
  - `password`: string (required, min 8 chars)
- **Response**: Sets JWT cookie on success, returns user data.
  `{ data: user, message: "login success" }`
- **Validation**: Returns 401 on invalid credentials.

## User

### GET `/me`
- **Auth Required**: JWT
- **Description**: Get the current authenticated user's profile.
- **Response**: User object

### GET `/library`
- **Auth Required**: JWT
- **Description**: Get the current user's game library.
- **Response**: List of games in the user's library.

### POST `/library`
- **Auth Required**: JWT
- **Description**: Add a game to the user's library.
- **Body**:
  - GameId : number (game IGDB id)
- **Response**: `{ message: "Game added to library" }`

### PUT `/library/:gameId`
- **Auth Required**: JWT
- **Description**: Update game status, rating, or favorite in the user's library , passing undefined to any field means it stays as is.
- **Body**:
  - `status`: Wishlist | Playing | Completed | Backlog | Dropped (optional)
  - `rating`: float 0-10 (optional)
  - `favorite`: boolean (optional)
- **Response**: `{ message: "Library game info saved" }`
- **Errors**: 400 if validation fails or gameId is missing/invalid.

### POST `/reviews/:gameId`
- **Auth Required**: JWT
- **Description**: Add a review for a game.
- **Body**:
  - `comment`: string (optional)
  - `rating`: float (required)
- **Response**: `{ message: "Review added successfully" }`
- **Errors**: 404 if game not found.

## Games

### GET `/games`
- **Query Params**:
  - `page`: integer (default 1)
  - `genre`: genre filter (optional)
  - `platform`: platform filter (optional)
  - `sort`: (az, etc.) (optional)
- **Description**: Get paginated list of games, optionally filtered by genre/platform, sorted.
- **Response**: List of games.

### GET `/games/:id`
- **Description**: Get details about a specific game by its ID.
- **Response**: Game object.

### GET `/genres`
- **Description**: Get all available game genres.
- **Response**: List of genres with game count per genre.

### GET `/platforms`
- **Description**: Get all available gaming platforms.
- **Response**: List of platforms with game count per platform.

---

## Additional Notes

- All endpoints returning or modifying user data require JWT authentication via a cookie.
- Validation errors return status 400 with error details.
- Most user-related endpoints rely on Passport middleware.

## Example Route File

```typescript
// packages/server/src/routes/index.ts
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

router.post("/reviews/:gameId", UsersRoute.reviewGame);
```

For more details, see controller implementations in `packages/server/src/controllers/`.
