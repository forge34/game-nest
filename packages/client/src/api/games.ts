import { safeFetch } from "@/utils";
import type { GamesAllIncluded, GenresWithGames } from "@game-forge/shared";
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

export { getAllGames, getGameById, getAllGenres };
