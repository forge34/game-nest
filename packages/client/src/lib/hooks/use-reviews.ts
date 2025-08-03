import { queryClient } from "@/api";
import { addReviewFn } from "@/api/user";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface addReviewContext {
  showToast: boolean;
}

function useReviews() {
  const addReviewMutation = useMutation({
    mutationFn: ({
      gameId,
      reviewbody,
    }: {
      gameId: string;
      reviewbody: string;
    }) => addReviewFn(gameId, reviewbody),
  });

  const addReview = (
    gameId: string,
    reviewbody: string,
    options?: addReviewContext,
  ) => {
    addReviewMutation.mutate(
      { gameId, reviewbody },
      {
        onSuccess() {
          if (options?.showToast) toast.success("Review added successfully");

          queryClient.invalidateQueries();
        },
      },
    );
  };

  return { addReview };
}

export default useReviews;
