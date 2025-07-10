import { safeFetch } from "@/utils";
import type {
  GamesAllIncluded,
  GenresWithGames,
  Library,
} from "@game-forge/shared";
import { queryOptions } from "@tanstack/react-query";

const getAllGames = () =>
  queryOptions({
    queryKey: ["game"],
    queryFn: () => safeFetch<GamesAllIncluded[]>("games", {}),
  });

const getGameById = (id: string) =>
  queryOptions({
    queryKey: ["game", id],
    queryFn: () => safeFetch<GamesAllIncluded>(`games/${id}`, {}),
  });

const getAllGenres = () =>
  queryOptions({
    queryKey: ["genre"],
    queryFn: () => safeFetch<GenresWithGames[]>("genres", {}),
  });

const getLibrary = () =>
  queryOptions({
    queryKey: ["library"],
    queryFn: () =>
      safeFetch<Library>("library", {
        credentials: "include",
      }),
  });

export { getAllGames, getGameById, getAllGenres, getLibrary };
