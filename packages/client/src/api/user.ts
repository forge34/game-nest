import { safeFetch } from "@/utils";

const addReviewFn = (gameId: string, reviewbody: string) => {
  return safeFetch(`reviews/${gameId}`, {
    method: "post",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment: reviewbody }),
  });
};

export { addReviewFn };
