import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import GameRating from "@/components/game-rating";
import { Badge } from "@/components/ui/badge";
import type { Game } from "@gridcollect/shared";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import HeartBtn from "./heart-btn";
import useLibrary from "@/lib/hooks/use-library";
import AddToLibraryButton from "./add-to-library-btn";
import useUser from "@/lib/hooks/use-user";

function CollapsibleCard({
  game,
  alwaysOpen,
}: {
  game: Game;
  alwaysOpen?: boolean;
}) {
  const releaseDate = game.releaseDate
    ? format(game.releaseDate, "dd MMM yyyy")
    : "Unknown";

  const { isFavourite, isInLibrary } = useLibrary();
  const { user } = useUser();

  return (
    <Collapsible
      alwaysOpen={alwaysOpen}
      className="bg-card py-2 px-4 rounded-md border"
    >
      <div className="relative">
        <CollapsibleTrigger>
          <div className="flex flex-col w-full">
            <img
              className="w-full  rounded-md "
              src={game.coverImage?.url.replace("t_thumb", "t_original")}
            />
            <div className="flex items-start gap-2 mt-2">
              <h3 className="text-sm md:text-md font-semibold break-words flex-1 leading-tight">
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

          {user && (
            <div className="flex justify-between mt-3">
              <AddToLibraryButton inLibrary={isInLibrary(game)} game={game} />
              <HeartBtn id={game.id} isFavourite={isFavourite(game)} />
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export default CollapsibleCard;
