import { safeFetch } from "@/utils";

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

  return safeFetch(`user/update_profile`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });
};

export { addReviewFn, uploadProfilePic };
