import type { FilterState } from "@/components/horizontal-filter";
import type { Game } from "@game-forge/shared";
import { useState } from "react";

function useFilter() {
  const [filter, setfilters] = useState<FilterState>({
    genres: [],
    platforms: [],
    sort: "",
  });

  const matchesGenre = (game: Game) =>
    filter.genres.length === 0 ||
    game.genres.some((g) => filter.genres.includes(g.name));

  const matchesPlatform = (game: Game) =>
    filter.platforms.length === 0 ||
    game.platforms.some((p) => filter.platforms.includes(p.name));

  return {
    filter,
    setfilters,
    matchesGenre,
    matchesPlatform,
  };
}

export default useFilter;
