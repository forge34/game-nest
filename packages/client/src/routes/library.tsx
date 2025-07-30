import { getLibrary } from "@/api/games";
import HoverCard from "@/components/hover-card";
import useLibrary from "@/lib/hooks/use-library";
import type { Library } from "@game-forge/shared";
import { createFileRoute } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import GameRating from "@/components/game-rating";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import HeartBtn from "@/components/heart-btn";

export const Route = createFileRoute("/library")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(getLibrary());

    return data;
  },
});

function RouteComponent() {
  const { library, isFavourite } = useLibrary();
  return (
    <div className="relative flex flex-col w-full h-full overflow-hidden rounded-xl py-3 px-5 gap-4">
      <h3 className="text-2xl font-semibold">My library</h3>
      <div className=" flex flex-row flex-wrap justify-center w-full gap-6">
        {library.map((g) => {
          return (
            <DetailsHoverCard
              g={g}
              key={g.game.igdbId.toString()}
              isFavourite={isFavourite(g.game)}
            />
          );
        })}
      </div>
    </div>
  );
}

function DetailsHoverCard({
  g,
  isFavourite,
}: {
  g: Library[number];
  isFavourite: boolean;
}) {
  const [open, setOpen] = useState(false);
  if (!g) return null;
  const game = g.game;
  const releaseDate = game.releaseDate
    ? format(game.releaseDate, "dd MMM yyyy")
    : "Unknown";
  const lastPlayedAt = g.lastPlayedAt
    ? format(g.lastPlayedAt || new Date(), "dd MMM yyyy")
    : "Unknown";

  return (
    <Dialog onOpenChange={setOpen} open={open} modal>
      <HoverCard game={game} className="flex-none basis-[13%]">
        <div className="flex flex-col absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
          <span className="text-sm text-center  font-semibold text-white">
            {game.title}
          </span>

          <DialogTrigger asChild>
            <Button variant="secondary" className="self-center" size="sm">
              View details
            </Button>
          </DialogTrigger>
        </div>
      </HoverCard>
      <DialogContent>
        <DialogHeader className="flex flex-row justify-between p-2">
          <DialogTitle>Game Details</DialogTitle>

          <HeartBtn
            iconSize={6}
            id={game.id}
            isFavourite={isFavourite}
            btnClassName="self-start"
          />
        </DialogHeader>
        <Separator />
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <h3 className="text-xl font-semibold">{game.title}</h3>
            <GameRating className="text-xs self-start" rating={game.rating} />
          </div>
          <div className="flex flex-row gap-2">
            {game?.genres.map((genre) => (
              <Badge className="text-foreground bg-accent-green" key={genre.id}>
                {genre.name}
              </Badge>
            ))}
          </div>
          <Separator />
          <div className="grid grid-cols-2 grid-rows-2">
            <p className="flex flex-col">
              <span className="text-muted-foreground"> Release date: </span>
              {releaseDate}
            </p>
            <p className="flex flex-col">
              <span className="text-muted-foreground">Hours played: </span>
              {g.hoursPlayed} hours
            </p>
            <p className="flex flex-col">
              <span className="text-muted-foreground">Progress: </span>
              {g.completion} %
            </p>
            <p className="flex flex-col">
              <span className="text-muted-foreground">Last played at: </span>
              {lastPlayedAt}
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <h3 className="font-semibold text-md">Current Status</h3>
            <Badge>{g.status}</Badge>
          </div>
          <h3 className="font-semibold text-md">Review</h3>
          <Textarea
            placeholder="No review added..."
            className="lg:max-h-[150px]"
          />
          <p className="text-muted-foreground mt-2">
            {game.reviews.length} User Reviews
          </p>
          <Button>check game</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
