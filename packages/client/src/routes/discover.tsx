import GenreFilter from "@/components/horizontal-filter";
import {
  filterStateSchema,
  type FilterState,
  type Game,
  type GenresWithGames,
} from "@game-forge/shared";
import {
  createFileRoute,
  Link,
  Outlet,
  useMatchRoute,
  useNavigate,
} from "@tanstack/react-router";
import { getAllGames, getAllGenres, getAllPlatforms } from "@/api/games";
import { useQuery } from "@tanstack/react-query";
import CollapsibleCard from "@/components/collapsible-card";
import { zodValidator } from "@tanstack/zod-adapter";
import useGames from "@/lib/hooks/use-games";
import GamePagination from "@/components/game-pagination";

export const Route = createFileRoute("/discover")({
  component: RouteComponent,
  loader: async ({
    context,
  }): Promise<{
    genres: GenresWithGames[];
    games: Game[];
  }> => {
    const genres = await context.queryClient.ensureQueryData(getAllGenres());
    const games = (await context.queryClient.ensureQueryData(getAllGames()))
      .games;

    return { games, genres };
  },
  validateSearch: zodValidator(filterStateSchema),
});

function RouteComponent() {
  const match = useMatchRoute();
  const isMatched = match({ to: "/discover" });
  const { data: genres = [] } = useQuery(getAllGenres());
  const { data: platforms = [] } = useQuery(getAllPlatforms());
  const filter = Route.useSearch();
  const { games, total } = useGames(filter);
  const navigate = useNavigate({ from: Route.fullPath });

  function onFilter(fs: FilterState) {
    navigate({
      search: fs,
    });
  }

  function clearFitlers() {
    navigate({
      search: filterStateSchema.parse({}),
    });
  }

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
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {games.map((game) => {
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
          <GamePagination
            currentPage={filter.page}
            totalItems={total}
            onPageChange={(page) => navigate({ search: () => ({ page }) })}
          />
        </div>
      )}
    </>
  );
}
