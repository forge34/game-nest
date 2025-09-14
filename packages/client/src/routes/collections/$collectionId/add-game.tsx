import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/collections/$collectionId/add-game")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  return (
    <Dialog open modal>
      <DialogContent
        className=" [&>button:last-child]:hidden bg-card"
        onInteractOutside={() => navigate({ to: ".." })}
      >
        <DialogHeader>
          <DialogTitle>Add game to collection</DialogTitle>
          <DialogDescription>
            Add games to to your collection here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row"></div>
      </DialogContent>
    </Dialog>
  );
}
