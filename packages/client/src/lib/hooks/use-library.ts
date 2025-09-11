import { queryClient } from "@/api";
import { getLibrary } from "@/api/games";
import { safeFetch } from "@/lib/utils";
import type { Game } from "@game-forge/shared";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import useUser from "./use-user";

export enum GameStatus {
  Wishlist = "Wishlist",
  Playing = "Playing",
  Completed = "Completed",
  Backlog = "Backlog",
  Dropped = "Dropped",
}
type GameUpdateOptions = {
  status?: GameStatus;
  favorite?: boolean;
  rating?: number;
};

const updateGameFn = (gameId: string, opts?: GameUpdateOptions) => {
  return safeFetch(`library/${gameId}`, {
    method: "put",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts),
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
  const { user } = useUser();
  const { data: library = [] } = useQuery({ ...getLibrary(), enabled: !!user });

  const updateMutation = useMutation({
    mutationFn: ({ id, opts }: { id: string; opts?: GameUpdateOptions }) =>
      updateGameFn(id, opts),
    onSuccess: () => {
      toast.success("game status updated successfully");
      queryClient.invalidateQueries();
    },
  });

  const addToLibraryMutation = useMutation({
    mutationFn: (id: string) => addToLibraryFn(id),
    onSuccess: () => {
      toast.success("game successfully added to library");

      queryClient.invalidateQueries();
    },
  });

  const isFavourite = (game: Game) =>
    library.some((g) => g.gameId === game.id && g.favorite);

  const updateGame = (gameId: string, opts?: GameUpdateOptions) => {
    updateMutation.mutate({ id: gameId, opts });
  };

  const addToLibrary = (id: string) => {
    addToLibraryMutation.mutate(id);
  };

  const isInLibrary = (game: Game) => library.some((g) => g.gameId === game.id);

  const countFavourites = () => library.filter((game) => game.favorite).length;

  return {
    library,
    isFavourite,
    updateGame,
    isInLibrary,
    addToLibrary,
    countFavourites,
  };
}

export default useLibrary;
