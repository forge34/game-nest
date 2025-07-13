import type { Game } from "@game-forge/shared";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

function HoverCard({ game }: { game: Game }) {
  const [show, setShow] = useState(false);

  return (
    <Button
      asChild
      variant="ghost"
      className="relative flex flex-col items-center gap-2 p-0 hover:bg-muted/10 transition-colors rounded-md overflow-hidden w-[150px] sm:w-[180px] md:w-[200px]"
    >
      <Link
        to={`/discover/$gameId`}
        params={{ gameId: `${game.igdbId}` }}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="block w-full h-full focus:outline-none"
      >
        <img
          src={game.coverImage?.url.replace("t_thumb", "t_cover_big")}
          className="w-full h-auto rounded-md object-cover"
          alt={game.title}
        />
        {show && (
          <>
            <div className="absolute inset-0 bg-muted/70 z-10 rounded-md" />
            <span className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center text-lg font-semibold text-white">
              {game.title}
            </span>
          </>
        )}
      </Link>
    </Button>
  );
}

export default HoverCard;
