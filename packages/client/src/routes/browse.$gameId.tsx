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
import { Tabs, TabsList } from "@/components/ui/tabs";
import { TabsContent, TabsTrigger } from "@/components/ui/tabs";

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
  console.log(game);
  return (
    <div className="flex w-full flex-col gap-6 py-6 px-8">
      <Tabs defaultValue="info"> 
        <TabsList className="bg-card">
          <TabsTrigger  value="info">Info</TabsTrigger>
          <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
        </TabsList>
        <TabsContent
          value="info"
          className="flex flex-col lg:flex-row my-4 bg-card border py-6 px-8 rounded-md"
        >
          <div className="flex-1 flex flex-col gap-2 pr-28">
            <h1 className="text-4xl font-bold">{game?.title}</h1>
            <h3 className="text-xl font-semibold text-muted-foreground">
              About
            </h3>
            <p className="text-muted-foreground">{game?.summary}</p>
            <div className="flex flex-row gap-4 mt-2 flex-wrap">
              <h3 className="block text-sm">Genres : </h3>
              {game?.genres.map((genre) => (
                <Badge
                  className="text-foreground bg-accent-green"
                  key={genre.id}
                >
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
          </div>

          <div className="w-full lg:w-[350px] flex flex-col gap-4">
            <img
              className="rounded-lg object-cover w-full h-auto"
              src={game?.coverImage?.url.replace("t_thumb", "t_original")}
              alt="Game Cover"
            />
          </div>
        </TabsContent>
        <TabsContent
          value="screenshots"
          className="flex flex-col gap-y-5 bg-card py-6 px-7 rounded-md border"
        >
          <h3 className="mx-10 text-3xl font-semibold">Screenshots </h3>
          <Carousel className="mx-10" opts={{ loop: true }}>
            <CarouselContent>
              {game?.screenshots.map((screenshot) => (
                <CarouselItem className="basis-1/3 pl-4 " key={screenshot.id}>
                  <img
                    className="rounded-md h-full"
                    src={screenshot.url.replace("t_thumb", "t_original")}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
