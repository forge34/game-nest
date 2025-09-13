import { safeFetch } from "@/lib/utils";
import type { User } from "@game-forge/shared";
import { queryOptions } from "@tanstack/react-query";

const addReviewFn = (gameId: string, reviewbody: string) => {
  return safeFetch(`reviews/${gameId}`, {
    method: "post",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment: reviewbody }),
  });
};

const uploadProfilePic = (img: File) => {
  const formData = new FormData();
  formData.append("avatar", img);

  return safeFetch(`users/update_profile`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });
};

const getUserById = (username: string) =>
  queryOptions({
    queryKey: ["user", username],
    queryFn: () => safeFetch<User>(`users/${username}`, {}),
  });

export { addReviewFn, uploadProfilePic, getUserById };
