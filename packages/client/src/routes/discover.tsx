import GenreFilter, {
  type FilterState,
  type SortOptions,
} from "@/components/horizontal-filter";
import type { Game, GenresWithGames } from "@game-forge/shared";
import {
  createFileRoute,
  Link,
  Outlet,
  useMatchRoute,
} from "@tanstack/react-router";
import { getAllGames, getAllGenres, getAllPlatforms } from "@/api/games";
import { useQuery } from "@tanstack/react-query";
import CollapsibleCard from "@/components/collapsible-card";
import useFilter from "@/lib/hooks/use-filter";

export const Route = createFileRoute("/discover")({
  component: RouteComponent,
  loader: async ({
    context,
  }): Promise<{
    genres: GenresWithGames[];
    games: Game[];
  }> => {
    const genres = await context.queryClient.ensureQueryData(getAllGenres());
    const games = await context.queryClient.ensureQueryData(getAllGames());

    return { games, genres };
  },
});

function RouteComponent() {
  const match = useMatchRoute();
  const isMatched = match({ to: "/discover" });
  const { data: genres = [] } = useQuery(getAllGenres());
  const { data: platforms = [] } = useQuery(getAllPlatforms());
  const { data: games = [] } = useQuery(getAllGames());
  const { filter, setfilters, matchesGenre, matchesPlatform } = useFilter();

  function onFilter(fs: FilterState) {
    setfilters({
      genres: fs.genres,
      platforms: fs.platforms,
      sort: fs.sort,
    });
  }
  console.log(filter);
  const filteredGames = games
    .filter((g) => matchesGenre(g) && matchesPlatform(g))
    .sort((a, b) => {
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
    });

  return (
    <>
      {!isMatched ? (
        <Outlet />
      ) : (
        <div className="flex flex-col mx-6 mask-y-from-04 gap-4">
          <GenreFilter
            state={{
              genres: filter.genres,
              platforms: filter.platforms,
              sort: filter.sort,
            }}
            filters={{ genres, platforms }}
            onChangeChecked={onFilter}
          />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredGames.map((game) => {
              return (
                <Link
                  to="/discover/$gameId"
                  params={{ gameId: game.igdbId as unknown as string }}
                  key={game.igdbId}
                >
                  <CollapsibleCard game={game} />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
