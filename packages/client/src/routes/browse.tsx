import GenreFilter from "@/components/horizontal-filter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardImage } from "@/components/ui/card";
import type { GamesAllIncluded, GenresWithGames } from "@game-forge/shared";
import {
  createFileRoute,
  Link,
  Outlet,
  useMatchRoute,
} from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { getAllGames, getAllGenres } from "@/api/games";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/browse")({
  component: RouteComponent,
  loader: async ({
    context,
  }): Promise<{
    genres: GenresWithGames[];
    games: GamesAllIncluded[];
  }> => {
    const genres = await context.queryClient.ensureQueryData(getAllGenres());
    const games = await context.queryClient.ensureQueryData(getAllGames());

    return { games, genres };
  },
});

function RouteComponent() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const match = useMatchRoute();
  const isMatched = match({ to: "/browse" });
  const { data: genres = [] } = useQuery(getAllGenres());
  const { data: games = [] } = useQuery(getAllGames());

  function onFilter(genres: string[]) {
    setSelectedGenres(genres);
  }

  return (
    <div className="flex flex-col mx-6 my-4 ">
      {!isMatched ? (
        <Outlet />
      ) : (
        <>
          <GenreFilter
            filters={genres}
            selectedGenres={selectedGenres}
            onChangeChecked={onFilter}
          />
          <div className="flex flex-col mt-4 gap-y-4 ">
            {games.map((game) => {
              if (
                selectedGenres.length > 0 &&
                !game.genres.some((genre) =>
                  selectedGenres.includes(genre.name),
                )
              ) {
                return null;
              }

              const releaseDate = game.releaseDate
                ? format(game.releaseDate, "dd MMM yyyy")
                : "Unknown";

              return (
                <Link
                  to="/browse/$gameId"
                  params={{ gameId: game.igdbId as unknown as string }}
                  key={game.id}
                >
                  <Card className="flex flex-row py-2 px-4">
                    <CardImage
                      className="w-[12rem] h-[8rem] rounded-md"
                      src={game.coverImage?.url.replace(
                        "t_thumb",
                        "t_original",
                      )}
                    />
                    <CardContent className="flex flex-col px-4 w-full">
                      <h3 className="text-lg font-semibold">{game.title}</h3>
                      <div className="flex flex-row gap-4 mt-2 flex-wrap">
                        {game.genres.map((genre) => (
                          <Badge
                            variant="secondary"
                            className="bg-accent-green text-foreground"
                            key={genre.id}
                          >
                            {genre.name}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-row gap-4 mt-2 flex-wrap">
                        {game.platforms.map((platform) => (
                          <Badge
                            variant="secondary"
                            className="bg-foreground text-muted"
                            key={platform.id}
                          >
                            {platform.name}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-muted-foreground mt-2 text-sm">
                        {releaseDate}
                      </p>
                      <p className="text-muted-foreground mt-2 text-sm">
                        {game.reviews.length} User Reviews
                      </p>
                    </CardContent>
                    <CardContent className="flex flex-col py-3 ">
                      <Button variant="outline">
                        <Heart />
                      </Button>
                      <Button className="mt-auto">Visit page</Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
