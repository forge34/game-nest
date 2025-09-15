import useLibrary from "@/lib/hooks/use-library";
import StarRating from "./star-rating";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import UserAvatar from "./user-avatar";
import type { Review as ReviewType, UserGame } from "@gridcollect/shared";
import useReviews from "@/lib/hooks/use-reviews";
import { useState } from "react";
import Review from "./review";

export default function ReviewInput({
  gameId,
  rating,
  review,
  userData,
}: {
  gameId: string;
  rating?: number | null;
  review?: ReviewType | null;
  userData?: UserGame;
}) {
  const { updateGame } = useLibrary();
  const { addReview } = useReviews();
  const [textareaValue, setTextAreaValue] = useState("");
  function onRatingChange(rating: number) {
    updateGame(gameId, {
      rating,
    });
  }

  const validRating = rating ? rating : 0;
  return (
    <div className="flex flex-row gap-4 h-64 lg:h-[250px] w-2xl">
      <UserAvatar avatarUrl={userData?.user.avatarUrl} size={64} />
      <div className="flex flex-col w-full h-full gap-3">
        <StarRating
          onRatingChange={onRatingChange}
          initialRating={validRating}
        />
        {review ? (
          <Review review={review} userGame={userData} />
        ) : (
          <>
            <Textarea
              placeholder="No review added..."
              className="h-full max-w-fit md:max-w-96"
              onChange={(e) => setTextAreaValue(e.target.value)}
            />
            <Button
              className="self-start"
              onClick={() => {
                if (typeof textareaValue === "string" && textareaValue.trim() !== "") {
                  addReview(gameId, textareaValue, {
                    showToast: false,
                  });
                }
              }}
            >
              Add review
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
