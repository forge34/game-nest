import type { UserGame, Review as ReviewType } from "@game-forge/shared";
import StarRating from "./star-rating";
import UserAvatar from "./user-avatar";

function Review({
  review,
  userGame,
}: {
  review?: ReviewType;
  userGame?: UserGame;
}) {
  if (!review) {
    return <p>no review</p>;
  }

  if (!userGame) {
    return <p>Failed to load user data</p>;
  }

  return (
    <div className="flex flex-row gap-2">
      <UserAvatar />
      <div className="flex flex-col px-2">
        <h3>{userGame.user.name}</h3>
        {userGame?.rating ? (
          <StarRating initialRating={userGame.rating} disabled size="sm" />
        ) : (
          <p>Not rated</p>
        )}
        <p className="text-sm text-muted-foreground">
          {review?.comment ?? "Not reviewd"}
        </p>
      </div>
    </div>
  );
}
export default Review;
