import { cn } from "@/lib/utils";
import type { Game } from "@game-forge/shared";
import { useState } from "react";

type HoverCardProps = {
  game: Game;
  children: React.ReactNode;
} & React.ComponentProps<"div">;

function HoverCard({ game, children, className, ...props }: HoverCardProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-2 p-0 hover:bg-muted/10 transition-colors rounded-md overflow-hidden w-[150px] sm:w-[180px] md:w-[200px]",
        className,
      )}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      {...props}
    >
      <img
        src={game.coverImage?.url.replace("t_thumb", "t_cover_big")}
        className="w-full h-auto rounded-md object-cover"
        alt={game.title}
      />
      {show && (
        <>
          <div className="absolute inset-0 bg-muted/70 z-10 rounded-md" />
          {children}
        </>
      )}
    </div>
  );
}

export default HoverCard;
