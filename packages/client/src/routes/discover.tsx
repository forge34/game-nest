import GenreFilter from "@/components/horizontal-filter";
import type { Game, GenresWithGames } from "@game-forge/shared";
import {
  createFileRoute,
  Link,
  Outlet,
  useMatchRoute,
} from "@tanstack/react-router";
import { useState } from "react";
import { getAllGames, getAllGenres} from "@/api/games";
import { useQuery } from "@tanstack/react-query";
import CollapsibleCard from "@/components/collapsible-card";

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
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const match = useMatchRoute();
  const isMatched = match({ to: "/discover" });
  const { data: genres = [] } = useQuery(getAllGenres());
  const { data: games = [] } = useQuery(getAllGames());

  function onFilter(genres: string[]) {
    setSelectedGenres(genres);
  }

  return (
    <>
      {!isMatched ? (
        <Outlet />
      ) : (
        <div className="flex flex-col mx-6 mask-y-from-04 gap-4">
          <GenreFilter
            filters={genres}
            selectedGenres={selectedGenres}
            onChangeChecked={onFilter}
          />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {games.map((game) => {
              if (
                selectedGenres.length > 0 &&
                !game.genres.some((genre) =>
                  selectedGenres.includes(genre.name),
                )
              ) {
                return null;
              }

              return (
                <Link
                  to="/discover/$gameId"
                  params={{ gameId: game.igdbId as unknown as string }}
                  key={game.id}
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
