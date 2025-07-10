import { queryClient } from "@/api";
import { getLibrary } from "@/api/games";
import { safeFetch } from "@/utils";
import type { Game } from "@game-forge/shared";
import { useMutation, useQuery } from "@tanstack/react-query";

const markAsFavouriteFn = (gameId: string) => {
  return safeFetch(`library/${gameId}`, {
    method: "post",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
};

const addToLibraryFn = (gameId: string) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const addToLibraryMutation = useMutation({
    mutationFn: (id: string) => addToLibraryFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const isFavourite = (game: Game) =>
    library.some((g) => g.gameId === game.id && g.favorite);

  const toggleFavourite = (gameId: string) => {
    favouriteMutation.mutate(gameId);
  };

  const addToLibrary = (id: string) => {
    addToLibraryMutation.mutate(id);
  };

  const isInLibrary = (game: Game) =>
    library.some((g) => g.gameId === game.id);

  const countFavourites = () => library.filter((game) => game.favorite).length;

  return {
    library,
    isFavourite,
    toggleFavourite,
    isInLibrary,
    addToLibrary,
    countFavourites,
  };
}

export default useLibrary;
