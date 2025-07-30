import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import useLibrary from "@/lib/hooks/use-library";
import { cn } from "@/lib/utils";

function HeartBtn({
  id,
  isFavourite,
  btnClassName,
  iconSize,
}: {
  btnClassName?: string;
  iconSize?: number;
  isFavourite: boolean;
  id: number;
}) {
  const { toggleFavourite } = useLibrary();

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          type="button"
          variant="outline"
          aria-label={isFavourite ? "Unmark favourite" : "Mark favourite"}
          className={cn(btnClassName)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavourite(`${id}`);
          }}
        >
          <Heart
            color="var(--heart)"
            size={iconSize}
            fill={isFavourite ? "var(--heart)" : "transparent"}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent
        className="bg-background border"
        arrowClassName="bg-background fill-background border-b-1 border-r-1"
      >
        <p>{isFavourite ? "Unmark" : "Mark"} favourite</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default HeartBtn;
