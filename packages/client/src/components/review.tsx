import type { UserGame, Review as ReviewType } from "@gridcollect/shared";
import StarRating from "./star-rating";
import UserProfileLink from "./user-profile-link";

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
    <div className="flex flex-col gap-2">
      <UserProfileLink
        avatarUrl={userGame.user.avatarUrl}
        username={userGame.user.name}
      />
      {userGame?.rating ? (
        <StarRating initialRating={userGame.rating} disabled size="sm" />
      ) : (
        <p>Not rated</p>
      )}
      <p className="text-sm text-muted-foreground">
        {review?.comment ?? "Not reviewd"}
      </p>
    </div>
  );
}
export default Review;
