import type { Library } from "@game-forge/shared";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import HoverCard from "../hover-card";
import { Button } from "../ui/button";
import GameCardContent from "./card-content";

function GameCard({ g }: { g: Library[number] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  if (!g) return null;

  const game = g.game;

  function handleOpenChange(open: boolean) {
    setIsOpen(open);

    if (!open) setEditMode(false);
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen} modal>
      <HoverCard game={game} className="flex-none basis-[13%]">
        <div className="flex flex-col absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
          <span className="text-sm text-center  font-semibold text-white">
            {game.title}
          </span>

          <DialogTrigger asChild>
            <Button variant="secondary" className="self-center" size="sm">
              View details
            </Button>
          </DialogTrigger>
        </div>
      </HoverCard>
      <GameCardContent g={g} editMode={editMode} setEditMode={setEditMode} />
    </Dialog>
  );
}

export default GameCard;
