import { createFileRoute, Link } from "@tanstack/react-router";

import { Card, CardAction, CardContent, CardImage } from "@/components/ui/card";
import type { GamesAllIncluded } from "@game-forge/shared";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { GameNews } from "@/components/game-news";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  loader: async (): Promise<GamesAllIncluded[]> => {
    const res = await fetch(`${import.meta.env.VITE_API}/games`, {
      mode: "cors",
    });

    return await res.json();
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();

  const featured = data[Math.floor(Math.random() * data.length)];
  console.log(featured.rating);

  return (
    <div className="flex flex-row mx-16 my-4  gap-4">
      <div className="flex flex-col ">
        <h1 className="text-2xl font-bold my-2">Featured Game</h1>

        <Card className="flex flex-row p-4  w-[48rem] items-start">
          <CardImage
            className="w-[12rem]  rounded-md object-cover flex-shrink-0"
            src={featured.coverImage?.url.replace("t_thumb", "t_original")}
            alt={featured.title}
          />
          <CardContent className="flex flex-col h-full justify-between">
            <h3 className="text-xl font-semibold">{featured.title}</h3>
            <p className="text-sm my-2 text-muted-foreground line-clamp-4">
              {featured.summary}
            </p>
            <div className="flex flex-row gap-4 mt-2 flex-wrap">
              {featured.genres.map((genre) => (
                <Badge  key={genre.id}>
                  {genre.name}
                </Badge>
              ))}
            </div>
            <CardAction className="flex flex-row mt-auto gap-4">
              <Button>
                <Link to="/">Go to Game page</Link>
              </Button>
              <Button variant="outline">
                <Heart color="red" />
                <Link to="/">Add to favourites</Link>
              </Button>
            </CardAction>
          </CardContent>
        </Card>
        <GameNews />
      </div>
      <ScrollArea className="h-[48rem] w-[20rem] border rounded-md bg-card ml-auto">
        <div className="p-4">
          <h4 className="mb-4 text-md font-medium leading-none">
            Popular games
          </h4>
          <div className="space-y-2">
            {data.map((game) => (
              <div key={game.id} className="flex items-center gap-2 hover:bg-muted/10 transition-colors rounded-md">
                <img
                  src={game.coverImage?.url.replace("t_thumb", "t_cover_big")}
                  className="w-[4rem] h-[4rem] rounded object-cover"
                  alt={game.title}
                />
                <span className="text-sm">{game.title}</span>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>{" "}
    </div>
  );
}
