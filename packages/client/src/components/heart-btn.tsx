import { useMarkAsFavourite } from "@/api/games";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

function HeartBtn({ id, isFavourite }: { isFavourite: boolean; id: number }) {
  const favouriteFn = useMarkAsFavourite();

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button
          type="button"
          variant="outline"
          aria-label={isFavourite ? "Unmark favourite" : "Mark favourite"}
          onClick={() => favouriteFn.mutate(`${id}`)}
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
