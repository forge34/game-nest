import GenreFilter, { type FilterState } from "@/components/horizontal-filter";
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
  const { compare, filter, setfilters, matchesGenre, matchesPlatform } =
    useFilter();

  function onFilter(fs: FilterState) {
    setfilters({
      genres: fs.genres,
      platforms: fs.platforms,
      sort: fs.sort,
    });
  }

  function clearFitlers() {
    console.log("clearing")
    setfilters({
      genres: [],
      platforms: [],
      sort: "az",
    });
  }
  const filteredGames = games
    .filter((g) => matchesGenre(g) && matchesPlatform(g))
    .sort(compare);

  return (
    <>
      {!isMatched ? (
        <Outlet />
      ) : (
        <div className="flex flex-col mx-6 mask-y-from-04 gap-4">
          <GenreFilter
            onClear={clearFitlers}
            state={filter}
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
