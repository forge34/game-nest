import { Button } from "@/components/ui/button";
import { Check, Library, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import useLibrary from "@/lib/hooks/use-library";
import type { Game } from "@game-forge/shared";

type props = React.ComponentProps<"button"> & {
  display?: "icon" | "button";
  inLibrary: boolean;
  game: Game;
};

function AddToLibraryButton({
  display = "button",
  inLibrary,
  game,
  ...props
}: props) {
  const { addToLibrary } = useLibrary();
  const btnText = inLibrary ? "Show in library" : "Add to library";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToLibrary(game.igdbId.toString());
          }}
          {...props}
        >
          {display === "icon" ? (
            <>
              {inLibrary ? <Check /> : <Plus />}
              <Library />
            </>
          ) : (
            btnText
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent
        className="bg-background border"
        arrowClassName="bg-background fill-background border-b-1 border-r-1"
      >
        <p>{inLibrary ? "In library" : "Add to library"}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default AddToLibraryButton;
