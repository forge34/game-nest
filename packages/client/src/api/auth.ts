import { useAuthStore } from "@/store/auth";
import { safeFetch } from "@/utils";
import type { User } from "@game-forge/shared";
import { queryOptions, useMutation } from "@tanstack/react-query";

export const getMe = () =>
  queryOptions({
    queryKey: ["me"],
    queryFn: () => safeFetch<User>("/me", { credentials: "include" }),
    staleTime: 1000 * 60 * 5,
  });

const loginFn = ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  return safeFetch<User>("login", {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
    credentials: "include",
    headers: { "content-Type": "application/json" },
  });
};

export const useLogin = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: loginFn,
    onSuccess: (user: User) => {
      setUser(user);
    },
  });
};

const signupFn = ({
  username,
  password,
  confirmPassword,
}: {
  username: string;
  password: string;
  confirmPassword: string;
}) => {
  return safeFetch("signup", {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
      confirmPassword,
    }),
    credentials: "include",
    headers: { "content-Type": "application/json" },
  });
};

export const useSign = () =>
  useMutation({
    mutationFn: signupFn,
  });
