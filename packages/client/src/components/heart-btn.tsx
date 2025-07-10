import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import useLibrary from "@/lib/hooks/use-library";

function HeartBtn({ id, isFavourite }: { isFavourite: boolean; id: number }) {
  const { toggleFavourite } = useLibrary();

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          type="button"
          variant="outline"
          aria-label={isFavourite ? "Unmark favourite" : "Mark favourite"}
          onClick={() => toggleFavourite(`${id}`)}
        >
          <Heart
            color="var(--heart)"
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
