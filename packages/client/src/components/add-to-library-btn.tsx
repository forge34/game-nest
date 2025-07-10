import { Button } from "@/components/ui/button";
import { Check, Library, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface props extends React.ComponentProps<"button"> {
  display?: "icon" | "button";
  inLibrary: boolean;
  onClick?: () => void;
}

function AddToLibraryButton({
  display = "button",
  inLibrary,
  onClick,
  ...props
}: props) {
  const btnText = inLibrary ? "Show in library" : "Add to library";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" onClick={onClick} {...props}>
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
