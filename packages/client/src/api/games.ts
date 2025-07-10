import { safeFetch } from "@/utils";
import type { Game, GenresWithGames, Library } from "@game-forge/shared";
import { queryOptions } from "@tanstack/react-query";

const getAllGames = () =>
  queryOptions({
    queryKey: ["game"],
    queryFn: () => safeFetch<Game[]>("games", {}),
  });

const getGameById = (id: string) =>
  queryOptions({
    queryKey: ["game", id],
    queryFn: () => safeFetch<Game>(`games/${id}`, {}),
  });

const getAllGenres = () =>
  queryOptions({
    queryKey: ["genre"],
    queryFn: () => safeFetch<GenresWithGames[]>("genres", {}),
  });

const getAllPlatforms = () =>
  queryOptions({
    queryKey: ["platform"],
    queryFn: () => safeFetch<GenresWithGames[]>("platforms", {}),
  });

const getLibrary = () =>
  queryOptions({
    queryKey: ["library"],
    queryFn: () =>
      safeFetch<Library>("library", {
        credentials: "include",
      }),
  });

export { getAllGames, getGameById, getAllGenres, getLibrary, getAllPlatforms };
