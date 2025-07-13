import { safeFetch, type RouteError } from "@/utils";
import type {
  FilterState,
  Game,
  GenresWithGames,
  Library,
  PlatformWithGames,
} from "@game-forge/shared";
import { queryOptions } from "@tanstack/react-query";

const getAllGames = (page?: number, filters?: FilterState) =>
  queryOptions({
    queryKey: ["game", { page, ...filters }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters) {
        filters.genres.forEach((g) => params.append("genre", g));
        filters.platforms.forEach((p) => params.append("platform", p));
        params.set("sort", filters.sort);
        params.set("page", page?.toString() || "1");
      }
      return safeFetch<Game[]>(`games?${params.toString()}`, {});
    },
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
    queryFn: () => safeFetch<PlatformWithGames[]>("platforms", {}),
  });

const getLibrary = () =>
  queryOptions({
    queryKey: ["library"],
    queryFn: () =>
      safeFetch<Library>("library", {
        credentials: "include",
      }),
    retry(failureCount, error: RouteError) {
      if (error.status === 401) return false;
      return failureCount < 3;
    },
  });

export { getAllGames, getGameById, getAllGenres, getLibrary, getAllPlatforms };
