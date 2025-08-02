import { getLibrary } from "@/api/games";
import HoverCard from "@/components/hover-card";
import useLibrary, { GameStatus } from "@/lib/hooks/use-library";
import { type Library } from "@game-forge/shared";
import { createFileRoute } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import GameRating from "@/components/game-rating";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import HeartBtn from "@/components/heart-btn";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { EditIcon } from "lucide-react";
import StarRating from "@/components/star-rating";
import { useAuthStore } from "@/store/auth";
import useReviews from "@/lib/hooks/use-reviews";

export const Route = createFileRoute("/library")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(getLibrary());

    return data;
  },
});

function RouteComponent() {
  const { library, isFavourite } = useLibrary();
  return (
    <div className="relative flex flex-col w-full h-full overflow-hidden rounded-xl py-3 px-5 gap-4">
      <h3 className="text-2xl font-semibold">My library</h3>
      <div className=" flex flex-row flex-wrap justify-center w-full gap-6">
        {library.map((g) => {
          return (
            <DetailsHoverCard
              g={g}
              key={g.game.igdbId.toString()}
              isFavourite={isFavourite(g.game)}
            />
          );
        })}
      </div>
    </div>
  );
}
const gameStatusOptions = [
  { value: "Wishlist", label: "Wishlist" },
  { value: "Playing", label: "Playing" },
  { value: "Completed", label: "Completed" },
  { value: "Backlog", label: "Backlog" },
  { value: "Dropped", label: "Dropped" },
];

function DetailsHoverCard({
  g,
  isFavourite,
}: {
  g: Library[number];
  isFavourite: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [rating, setRating] = useState(0);
  const user = useAuthStore((s) => s.user);
  const ownReview =
    g.game.reviews.find((r) => r.userId === user?.id)?.comment ||
    "No review added yet";

  const [status, setStatus] = useState<string | null>(null);
  const [review, setReview] = useState<string | null>(ownReview);
  const { updateGame } = useLibrary();
  const { addReview } = useReviews();

  if (!g) return null;

  const game = g.game;
  const releaseDate = game.releaseDate
    ? format(game.releaseDate, "dd MMM yyyy")
    : "Unknown";
  const lastPlayedAt = g.lastPlayedAt
    ? format(g.lastPlayedAt || new Date(), "dd MMM yyyy")
    : "Unknown";

  function handleOpenChange(open: boolean) {
    setIsOpen(open);

    if (!open) setEditMode(false);
  }

  function handleFinishEdit() {
    setEditMode(false);

    updateGame(g.game.igdbId.toString(), {
      status: (status as GameStatus) ?? "Backlog",
      rating,
    });

    if (typeof review === "string" && review.trim() !== "") {
      addReview(g.game.igdbId.toString(), review, {
        showToast: false,
      });
    }
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
      <DialogContent>
        <DialogHeader className="flex flex-row justify-between p-2">
          <DialogTitle>Game Details</DialogTitle>

          <div className="flex flex-row gap-x-2">
            <Button
              variant="outline"
              onClick={() => setEditMode((prev) => !prev)}
            >
              {editMode ? "Cancel" : <EditIcon />}
            </Button>
            <HeartBtn iconSize={6} id={game.id} isFavourite={isFavourite} />
          </div>
        </DialogHeader>
        <Separator />
        <div className="flex flex-col gap-2">
          <div className="flex flex-row justify-between">
            <h3 className="text-xl font-semibold">{game.title}</h3>
            <GameRating className="text-xs self-start" rating={game.rating} />
          </div>
          <div className="flex flex-row gap-2">
            {game?.genres.map((genre) => (
              <Badge className="text-foreground bg-accent-green" key={genre.id}>
                {genre.name}
              </Badge>
            ))}
          </div>
          <Separator />
          <div className="grid grid-cols-2 grid-rows-2">
            <p className="flex flex-col">
              <span className="text-muted-foreground"> Release date: </span>
              {releaseDate}
            </p>
            <p className="flex flex-col">
              <span className="text-muted-foreground">Hours played: </span>
              {g.hoursPlayed} hours
            </p>
            <p className="flex flex-col">
              <span className="text-muted-foreground">Progress: </span>
              {g.completion} %
            </p>
            <p className="flex flex-col">
              <span className="text-muted-foreground">Last played at: </span>
              {lastPlayedAt}
            </p>
          </div>
          <div className="flex flex-row gap-3 items-center">
            <h3 className="font-semibold text-md">Current Status</h3>
            {editMode ? (
              <>
                <Select onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" defaultValue={g.status} />
                  </SelectTrigger>
                  <SelectContent>
                    {gameStatusOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            ) : (
              <Badge>{g.status}</Badge>
            )}
          </div>
          <div className="flex flex-row gap-2">
            <h3 className="font-semibold text-md py-1">Your review Rating</h3>
            <StarRating
              onRatingChange={setRating}
              initialRating={g.rating || 0}
              disabled={!editMode}
            ></StarRating>
          </div>
          <h3 className="font-semibold text-md">Review</h3>
          {editMode ? (
            <Textarea
              onChange={(e) => setReview(e.target.value)}
              placeholder="No review added..."
              className="lg:max-h-[150px]"
              value={}
            />
          ) : (
            <p className="bg-card rounded-md border py-2 px-3">{ownReview}</p>
          )}
          <p className="text-muted-foreground mt-2">
            {game.reviews.length} User Reviews
          </p>
          {editMode ? (
            <Button variant="outline" onClick={handleFinishEdit}>
              Finish editing
            </Button>
          ) : (
            <Button>check game</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
