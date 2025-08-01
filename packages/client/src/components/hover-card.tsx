import { cn } from "@/lib/utils";
import type { Game } from "@game-forge/shared";
import { useState } from "react";

type HoverCardProps = {
  game: Game;
  children?: React.ReactNode;
  showOverlay?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
} & React.ComponentProps<"div">;

function HoverCard({
  game,
  showOverlay,
  children,
  className,
  ...props
}: HoverCardProps) {
  const [show, setShow] = useState(false);

  function handleEnter() {
    setShow(true);
  }

  function handleLeave() {
    setShow(false);
  }
  const overlayVisible = showOverlay ?? show;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-2 p-0 hover:bg-muted/10 transition-colors rounded-md overflow-hidden ",
        className,
      )}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      {...props}
    >
      <img
        src={game.coverImage?.url.replace("t_thumb", "t_cover_big")}
        className="w-full h-full rounded-md "
        alt={game.title}
      />
      {overlayVisible && (
        <>
          <div className="absolute inset-0 bg-muted/50 z-10 rounded-md" />
          {children}
        </>
      )}
    </div>
  );
}

export default HoverCard;
