import type { FilterState, SortOptions } from "@/components/horizontal-filter";
import type { Game } from "@game-forge/shared";
import { useState } from "react";

function useFilter() {
  const [filter, setfilters] = useState<FilterState>({
    genres: [],
    platforms: [],
    sort: "az",
  });

  const matchesGenre = (game: Game) =>
    filter.genres.length === 0 ||
    game.genres.some((g) => filter.genres.includes(g.name));

  const matchesPlatform = (game: Game) =>
    filter.platforms.length === 0 ||
    game.platforms.some((p) => filter.platforms.includes(p.name));

  const compare = (a: Game, b: Game) => {
    const sortType = filter.sort as SortOptions;
    switch (sortType) {
      case "az":
        return a.title.localeCompare(b.title); // A → Z
      case "za":
        return b.title.localeCompare(a.title); // Z → A
      case "rating":
        return (b.rating ?? 0) - (a.rating ?? 0); // high → low
      default:
        return 0;
    }
  };

  return {
    compare,
    filter,
    setfilters,
    matchesGenre,
    matchesPlatform,
  };
}

export default useFilter;
