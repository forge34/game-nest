import { createFileRoute, useMatchRoute } from "@tanstack/react-router";
import { Dialog } from "@/components/ui/dialog";
import { useState } from "react";
import GameCardContent from "@/components/library-card/card-content";
import useLibrary from "@/lib/hooks/use-library";

export const Route = createFileRoute("/library/$gameId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const [editMode, setEditMode] = useState(false);
  const { findGameById } = useLibrary();
  const { gameId } = Route.useParams();
  const match = useMatchRoute()({ to: "/library/$gameId/edit" });
  const g = findGameById(gameId);
  if (!g) return null;

  function handleOpenChange(open: boolean) {
    if (!open) setEditMode(false);
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={!!match} modal >
      <GameCardContent g={g} editMode={editMode} setEditMode={setEditMode} />
    </Dialog>
  );
}
