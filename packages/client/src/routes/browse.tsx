import GenreFilter from "@/components/horizontal-filter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardImage } from "@/components/ui/card";
import type { GamesAllIncluded, GenresWithGames } from "@game-forge/shared";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/browse")({
  component: RouteComponent,
  loader: async (): Promise<{
    genres: GenresWithGames[];
    games: GamesAllIncluded[];
  }> => {
    const genresRes = await fetch(`${import.meta.env.VITE_API}/genres`, {
      mode: "cors",
    });

    const gamesRes = await fetch(`${import.meta.env.VITE_API}/games`, {
      mode: "cors",
    });

    const genres = await genresRes.json();
    const games = await gamesRes.json();

    return { games, genres };
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  function onFilter(genres: string[]) {
    setSelectedGenres(genres);
  }


  return (
    <div className="flex flex-col mx-6 my-4 ">
      <GenreFilter
        filters={data.genres}
        selectedGenres={selectedGenres}
        onChangeChecked={onFilter}
      />

      <div className="flex flex-col mt-4 gap-y-4 ">
        {data.games.map((game) => {
          if (
            selectedGenres.length > 0 &&
            !game.genres.some((genre) => selectedGenres.includes(genre.name))
          ) {
            return null;
          }

          const releaseDate = game.releaseDate
            ? format(game.releaseDate, "dd MMM yyyy")
            : "Unknown";

          return (
            <Card className="flex flex-row py-2 px-4">
              <CardImage
                className="w-[12rem] h-[8rem] rounded-md"
                src={game.coverImage?.url.replace("t_thumb", "t_original")}
              />
              <CardContent className="flex flex-col px-4 w-full">
                <h3 className="text-lg font-semibold">{game.title}</h3>
                <div className="flex flex-row gap-4 mt-2 flex-wrap">
                  {game.genres.map((genre) => (
                    <Badge
                      variant="secondary"
                      className="bg-accent-green text-muted"
                      key={genre.id}
                    >
                      {genre.name}
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
              <CardContent className="flex flex-col ">
                <Button variant="outline">
                  <Heart  />
                </Button>
                <Button className="mt-auto">Visit page</Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
