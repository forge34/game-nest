import { safeFetch, type RouteError } from "@/lib/utils";
import type { User } from "@gridcollect/shared";
import { queryOptions, useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { queryClient } from ".";

export const getMe = () =>
  queryOptions({
    queryKey: ["me"],
    queryFn: () => safeFetch<User>("me", { credentials: "include" }, true),
    staleTime: 1000 * 60 * 5,
    retry: (_: number, error: RouteError) => {
      if (error.status === 401) {
        return false;
      }

      return true;
    },
  });

const loginFn = ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  return safeFetch<{ data: User }>("login", {
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
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginFn,
    onSuccess: () => {
      toast.success("Sucessful login");
      queryClient.invalidateQueries();
      navigate({ to: "/" });
    },
  });
};

const signupFn = ({
  username,
  password,
  confirmPassword,
  email,
}: {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}) => {
  return safeFetch("signup", {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
      confirmPassword,
      email,
    }),
    credentials: "include",
    headers: { "content-Type": "application/json" },
  });
};

export const useSign = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signupFn,
    onSuccess: () => {
      toast.success("Account created");
      navigate({ to: "/login" });
    },
  });
};
