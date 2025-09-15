import { type Game } from "@gridcollect/shared";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import GameRating from "@/components/game-rating";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import HeartBtn from "@/components/heart-btn";
import { EditIcon } from "lucide-react";

function GameCardHeader({
  game,
  isFavourite,
  editMode,
  setEditMode,
}: {
  game: Game;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  isFavourite: boolean;
}) {
  return (
    <>
      <DialogHeader className="flex flex-row justify-between p-2">
        <DialogTitle>Game Details</DialogTitle>

        <div className="flex flex-row gap-x-2">
          <Button
            variant="outline"
            onClick={() => setEditMode((prev) => !prev)}
          >
            {editMode ? "Cancel" : <EditIcon />}
          </Button>
          <HeartBtn iconSize={6} id={game.id} isFavourite={isFavourite} />
        </div>
      </DialogHeader>
      <Separator />
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
    </>
  );
}

export default GameCardHeader;
