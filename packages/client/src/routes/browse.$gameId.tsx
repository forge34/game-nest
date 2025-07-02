import { getGameById } from "@/api/games";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const Route = createFileRoute("/browse/$gameId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(
      getGameById(params.gameId),
    );

    return data;
  },
});

function RouteComponent() {
  const { data: game } = useQuery(getGameById(Route.useParams().gameId));

  return (
    <div className="flex flex-col mx-4 my-8 bg-card border rounded-md py-1 px-3">
      <div className="flex flex-col lg:flex-row mx-6 my-4 ">
        <div className="flex-1 flex flex-col gap-2 pr-28">
          <h1 className="text-4xl font-bold">{game?.title}</h1>
          <h3 className="text-xl font-semibold text-muted-foreground">About</h3>
          <p className="text-muted-foreground">{game?.summary}</p>
          <div className="flex flex-row gap-4 mt-2 flex-wrap">
            <h3 className="block text-sm">Genres : </h3>
            {game?.genres.map((genre) => (
              <Badge className="text-foreground bg-accent-green" key={genre.id}>
                {genre.name}
              </Badge>
            ))}
          </div>
          <div className="flex flex-row gap-4 my-4 flex-wrap">
            <h3 className="block text-sm">Platforms : </h3>
            {game?.platforms.map((platform) => (
              <Badge
                variant="secondary"
                className="bg-foreground text-muted"
                key={platform.id}
              >
                {platform.name}
              </Badge>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Screenshots </h3>
            <Carousel className="mx-4">
              <CarouselContent>
                {game?.screenshots.map((screenshot) => (
                  <CarouselItem className="basis-1/2" key={screenshot.id}>
                    <img
                      className="rounded-md"
                      src={screenshot.url.replace("t_thumb", "t_original")}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>

        <div className="w-full lg:w-[350px] flex flex-col gap-4">
          <img
            className="rounded-lg object-cover w-full h-auto"
            src={game?.coverImage?.url.replace("t_thumb", "t_original")}
            alt="Game Cover"
          />
        </div>
      </div>
    </div>
  );
}
