import { useQuery } from "@tanstack/react-query";
import { getLibrary } from "@/api/games";
import type { GamesAllIncluded } from "@game-forge/shared";

function useIsFavourite(game: GamesAllIncluded | undefined) {
  const { data: library = [] } = useQuery(getLibrary());

  if (!game || library.length === 0) return false;
  const isFavourite = library.some((g) => g.gameId === game.id && g.favorite);

  return isFavourite;
}

export default useIsFavourite;
