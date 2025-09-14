import { safeFetch } from "@/lib/utils";
import type { CollectionWithGames } from "@game-forge/shared";
import { queryOptions } from "@tanstack/react-query";

export type CollectionPagination = { limit: number; page: number };
const CollectionsQueries = {
  getById: (id: string) =>
    queryOptions({
      queryKey: ["collections", id],
      queryFn: () => safeFetch<CollectionWithGames>(`collections/${id}`, {}),
    }),
  getAll: (filters: Partial<CollectionPagination> = {}) =>
    queryOptions({
      queryKey: ["collections", filters],
      queryFn: () => {
        const page = filters.page ?? 1;
        const limit = filters.limit ?? 15;

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        return safeFetch<{ collections: CollectionWithGames[]; count: number }>(
          `collections?${params.toString()}`,
          {},
        );
      },
    }),
  getUserCollections: (userId: string) =>
    queryOptions({
      queryKey: ["collections", "user", userId],
      queryFn: () =>
        safeFetch<CollectionWithGames[]>(`users/${userId}/collections`, {}),
    }),
};

const CollectionsMutations = {
  createCollection: ({
    name,
    description,
  }: {
    name: string;
    description?: string;
  }) =>
    safeFetch<CollectionWithGames>("collections", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description }),
    }),

  updateCollection: ({
    id,
    name,
    description,
  }: {
    id: string;
    name?: string;
    description?: string;
  }) =>
    safeFetch<CollectionWithGames>(`collections/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description }),
    }),

  deleteCollection: (id: string) =>
    safeFetch<{ message: string }>(`collections/${id}`, {
      method: "DELETE",
      credentials: "include",
    }),

  addGameToCollection: ({ id, gameId }: { id: string; gameId: string }) =>
    safeFetch<{ message: string }>(`collections/${id}/games/${gameId}`, {
      method: "POST",
      credentials: "include",
    }),

  removeGameFromCollection: ({ id, gameId }: { id: string; gameId: string }) =>
    safeFetch<{ message: string }>(`collections/${id}/games/${gameId}`, {
      method: "DELETE",
      credentials: "include",
    }),
};

export { CollectionsMutations, CollectionsQueries };
