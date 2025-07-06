import clsx from "clsx";
import { Badge } from "./ui/badge";

function GameRating({ rating }: { rating: number | null }) {
  return (
    <>
      {typeof rating === "number" ? (
        <Badge
          className={clsx("text-md", {
            "text-accent-green border-accent-green": rating >= 75,
            "text-yellow-600 border-yellow-600": rating < 75 && rating >= 50,
            "text-red-600 border-red-600": rating < 50,
          })}
          variant="outline"
        >
          {rating.toFixed(1)}
        </Badge>
      ) : (
        <p className="text-muted-foreground text-sm">Not rated</p>
      )}
    </>
  );
}

export default GameRating;
