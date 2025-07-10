import { getLibrary } from "@/api/games";
import { safeFetch } from "@/utils";
import type { GamesAllIncluded } from "@game-forge/shared";
import { useMutation, useQuery } from "@tanstack/react-query";

const markAsFavouriteFn = (gameId: string) => {
  return safeFetch(`library/${gameId}`, {
    method: "post",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
};

const addToLibraryFn = (gameId: string) => {
  console.log(gameId);
  return safeFetch("library", {
    method: "post",
    credentials: "include",
    body: JSON.stringify({
      gameId,
    }),
    headers: { "Content-Type": "application/json" },
  });
};

function useLibrary() {
  const { data: library = [] } = useQuery(getLibrary());

  const favouriteMutation = useMutation({
    mutationFn: (id: string) => markAsFavouriteFn(id),
  });

  const addToLibraryMutation = useMutation({
    mutationFn: (id: string) => addToLibraryFn(id),
  });

  const isFavourite = (game: GamesAllIncluded) =>
    library.some((g) => g.gameId === game.id && g.favorite);

  const toggleFavourite = (gameId: string) => {
    favouriteMutation.mutate(gameId);
  };

  const addToLibrary = (id: string) => {
    addToLibraryMutation.mutate(id);
  };

  return {
    library,
    isFavourite,
    toggleFavourite,
    addToLibrary,
  };
}

export default useLibrary;
