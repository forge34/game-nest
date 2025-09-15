import useLibrary, { GameStatus } from "@/lib/hooks/use-library";
import { type Library } from "@gridcollect/shared";
import { DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import StarRating from "@/components/star-rating";
import useReviews from "@/lib/hooks/use-reviews";
import GameCardHeader from "./card-header";
import useUser from "@/lib/hooks/use-user";
import { useNavigate } from "@tanstack/react-router";

const reviewPlaceholder = "No review added yet...";

function GameCardContent({
  g,
  editMode,
  setEditMode,
}: {
  g: Library[number];
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [rating, setRating] = useState(0);
  const { user } = useUser();

  const gameStatusOptions = [
    { value: "Wishlist", label: "Wishlist" },
    { value: "Playing", label: "Playing" },
    { value: "Completed", label: "Completed" },
    { value: "Backlog", label: "Backlog" },
    { value: "Dropped", label: "Dropped" },
  ];

  const game = g.game;
  const [status, setStatus] = useState<string | null>(null);
  const [review, setReview] = useState<string | null>(null);
  const { updateGame, isFavourite } = useLibrary();
  const { addReview } = useReviews();
  const navigate = useNavigate();

  function handleFinishEdit() {
    setEditMode(false);

    updateGame(g.game.id.toString(), {
      status: (status as GameStatus) ?? "Backlog",
      rating,
    });

    if (typeof review === "string" && review.trim() !== "") {
      addReview(g.game.id.toString(), review, {
        showToast: false,
      });
    }
  }

  const releaseDate = game.releaseDate
    ? format(game.releaseDate, "dd MMM yyyy")
    : "Unknown";
  const lastPlayedAt = g.lastPlayedAt
    ? format(g.lastPlayedAt || new Date(), "dd MMM yyyy")
    : "Unknown";

  const userReview =
    game.reviews.find((r) => r.userId === user?.id)?.comment || "";

  const displayReview = editMode
    ? (review ?? userReview)
    : userReview || reviewPlaceholder;

  return (
    <DialogContent
      className="bg-card [&>button:last-child]:hidden"
      onInteractOutside={() => navigate({ to: "/library" })}
    >
      <div className="flex flex-col gap-2">
        <GameCardHeader
          game={game}
          isFavourite={isFavourite(game)}
          editMode={editMode}
          setEditMode={setEditMode}
        />
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
            value={review ?? userReview}
            className="lg:max-h-[150px]"
          />
        ) : (
          <p className="bg-card rounded-md border py-2 px-3">{displayReview}</p>
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
  );
}

export default GameCardContent;
