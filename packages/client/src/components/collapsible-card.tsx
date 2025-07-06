import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import GameRating from "@/components/game-rating";
import { Badge } from "@/components/ui/badge";
import type { GamesAllIncluded } from "@game-forge/shared";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

function CollapsibleCard({ game }: { game: GamesAllIncluded }) {
  const releaseDate = game.releaseDate
    ? format(game.releaseDate, "dd MMM yyyy")
    : "Unknown";

  return (
    <Collapsible className="bg-card py-2 px-4 rounded-md border">
      <div className="relative">
        <CollapsibleTrigger asChild>
          <div className="flex flex-col w-full">
            <img
              className="w-full h-[11rem] rounded-md object-cover"
              src={game.coverImage?.url.replace("t_thumb", "t_original")}
            />
            <div className="flex items-start gap-2 mt-2">
              <h3 className="text-xl font-semibold break-words flex-1 leading-tight">
                {game.title}
              </h3>
              <GameRating className="text-xs" rating={game.rating} />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent
          className={cn(
            "overflow-hidden top-full left-0 bg-card w-collapsible mt-4 rounded-md transition-all duration-500 ease-in-out",
            "data-[state=open]:animate-expand data-[state=closed]:animate-collapse",
          )}
        >
          <div className="flex flex-row gap-1 mt-1 flex-wrap">
            {game.genres.map((genre) => (
              <Badge
                variant="outline"
                className=" text-tiny text-foreground"
                key={genre.id}
              >
                {genre.name}
              </Badge>
            ))}
          </div>

          <div className="flex flex-row gap-1 mt-2 flex-wrap">
            {game.platforms.map((platform) => (
              <Badge
                variant="secondary"
                className="bg-foreground text-tiny text-muted"
                key={platform.id}
              >
                {platform.name}
              </Badge>
            ))}
          </div>
          <div className="flex flex-row w-full  mt-2">
            <h3 className="text-muted-foreground text-xs">Release Date</h3>
            <p className="text-muted-foreground  text-xs ml-auto">
              {releaseDate}
            </p>
          </div>
          <Separator className="my-1" />
          <p className="text-muted-foreground mt-2 text-xs">
            {game.reviews.length} User Reviews
          </p>

          <div className="flex justify-end mt-3">
            <Button size="icon" variant="outline">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export default CollapsibleCard;
