import { createFileRoute, Link } from "@tanstack/react-router";

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import type { GamesAllIncluded } from "@game-forge/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { GameNews } from "@/components/game-news";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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

  return (
    <div className="flex flex-col gap-4 mt-4 mx-4 lg:mx-10">
      <Card className="order-1 w-[75%] mx-auto py-3">
        <CardHeader className="w-full ">
          <h3 className="text-2xl font-bold">Featured Game</h3>
          <img
            className="w-full rounded-md object-cover flex-shrink-0"
            src={featured.coverImage?.url.replace("t_thumb", "t_original")}
            alt={featured.title}
          />
        </CardHeader>
        <CardContent className="flex flex-col h-full justify-between">
          <h3 className="text-xl font-semibold">{featured.title}</h3>
          <p className="text-sm my-2 text-muted-foreground line-clamp-4">
            {featured.summary}
          </p>
          <div className="flex flex-row gap-4 mt-2 flex-wrap">
            <h3 className="block text-sm">Genres : </h3>
            {featured.genres.map((genre) => (
              <Badge className="text-foreground bg-accent-green" key={genre.id}>
                {genre.name}
              </Badge>
            ))}
          </div>
          <div className="flex flex-row gap-4 my-4 flex-wrap">
            <h3 className="block text-sm">Platforms : </h3>
            {featured.platforms.map((platform) => (
              <Badge
                variant="secondary"
                className="bg-foreground text-muted"
                key={platform.id}
              >
                {platform.name}
              </Badge>
            ))}
          </div>
          <CardAction className="flex flex-row mt-auto gap-4">
            <Button>
              <Link
                to="/browse/$gameId"
                params={{ gameId: `${featured.igdbId}` }}
              >
                Go to Game page
              </Link>
            </Button>
            <Button variant="outline">
              <Heart color="var(--heart)" />
              <Link to="/">Add to library</Link>
            </Button>
          </CardAction>
        </CardContent>
      </Card>
      <GameNews className="order-3 row-start-2 " />
      <div className="order-2 border rounded-md bg-card py-2 px-8 h-full">
        <h3 className="text-2xl font-semibold">Popular games</h3>
        <Carousel className="mt-2 mx-6" opts={{ loop: true }}>
          <CarouselContent>
            {data.map((game) => (
              <CarouselItem key={game.igdbId} className="basis-1/5">
                <Link
                  to={`/browse/$gameId`}
                  params={{ gameId: `${game.igdbId}` }}
                >
                  <div className="flex flex-col items-center gap-2 hover:bg-muted/10 transition-colors rounded-md">
                    <img
                      src={game.coverImage?.url.replace(
                        "t_thumb",
                        "t_cover_big",
                      )}
                      className="w-[12rem] rounded-md object-cover"
                      alt={game.title}
                    />
                    <span className="text-sm">{game.title}</span>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
