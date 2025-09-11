import { getGameById } from "@/api/games";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { ratingCategories, ratingOrganizations } from "@/lib/utils";
import GameRating from "@/components/game-rating";

import HeartBtn from "@/components/heart-btn";
import useLibrary from "@/lib/hooks/use-library";
import AddToLibraryButton from "@/components/add-to-library-btn";
import type { Game, Review, User, UserGame } from "@game-forge/shared";
import StarRating from "@/components/star-rating";
import { User as Avatar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import useUser from "@/lib/hooks/use-user";
import ReviewInput from "@/components/review-input";

export const Route = createFileRoute("/discover/$gameId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(
      getGameById(params.gameId),
    );

    return data;
  },
});

function RouteComponent() {
  const { data: game } = useQuery(getGameById(Route.useParams().gameId));

  const { user } = useUser();
  if (!game) {
    return <p>Game data not available</p>;
  }

  return (
    <div className="flex w-full flex-col gap-6 py-6 px-8">
      <Tabs defaultValue="info">
        <TabsList className="bg-card">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <InfoTab game={game} user={user} />
        <ScreenshotTab game={game} />
        <ReviewTab game={game} user={user} />
      </Tabs>
    </div>
  );
}

function ReviewTab({ game, user }: { game: Game; user?: User | null }) {
  const userReview = game.reviews.find((r) => r.userId === user?.id);
  const userData = game.userGames.find((g) => g.userId === user?.id);

  return (
    <TabsContent value="reviews" className="flex flex-col gap-4 p-2 md:p-6">
      {user && (
        <>
          <h3 className="text-xl font-bold">Your Review</h3>
          {userReview ? (
            <Review review={userReview} userGame={userData} />
          ) : (
            <ReviewInput
              gameId={game?.igdbId.toString()}
              rating={userData?.rating}
              review={userReview}
              userData={userData}
            />
          )}
          <Separator />
        </>
      )}
      <h3 className="text-xl font-bold">{user ? "Other" : ""} Reviews</h3>
      {game.reviews.length > 0 ? (
        game.reviews.map((review) => {
          if (review.userId === user?.id) return null;

          return (
            <Review
              key={review.id}
              review={review}
              userGame={game.userGames.find((g) => g.userId === review.userId)}
            />
          );
        })
      ) : (
        <h3 className="text-md font-light">No reviews yet</h3>
      )}
    </TabsContent>
  );
}

export function Review({
  review,
  userGame,
}: {
  review?: Review;
  userGame?: UserGame;
}) {
  if (!review) {
    return <p>no review</p>;
  }

  if (!userGame) {
    return <p>Failed to load user data</p>;
  }

  return (
    <div className="flex flex-row gap-2">
      <div className="flex items-center justify-center w-10 h-10 bg-gray-300 text-gray-600 shrink-0">
        <Avatar className="w-5 h-5" />
      </div>
      <div className="flex flex-col px-2">
        <h3>{userGame.user.name}</h3>
        {userGame?.rating ? (
          <StarRating initialRating={userGame.rating} disabled size="sm" />
        ) : (
          <p>Not rated</p>
        )}
        <p className="text-sm text-muted-foreground">
          {review?.comment ?? "Not reviewd"}
        </p>
      </div>
    </div>
  );
}

function ScreenshotTab({ game }: { game: Game }) {
  return (
    <TabsContent value="screenshots" className="flex flex-col gap-y-5">
      <h3 className="mx-10 text-2xl font-semibold">Screenshots </h3>
      <Carousel className="mx-10" opts={{ loop: true }}>
        <CarouselContent>
          {game.screenshots.map((screenshot) => (
            <CarouselItem
              className="basis-full sm:basis-1/2 lg:basis-1/3 pl-4"
              key={screenshot.id}
            >
              <img
                className="rounded-md h-full border"
                src={screenshot.url.replace("t_thumb", "t_original")}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </TabsContent>
  );
}

function InfoTab({ game, user }: { game: Game; user?: User | null }) {
  const { isFavourite, isInLibrary } = useLibrary();

  return (
    <TabsContent
      value="info"
      className="flex flex-col lg:flex-row my-4 bg-card border py-6 px-8 rounded-md"
    >
      <div className="flex-1 flex flex-col gap-2 pr-28">
        <div className="flex flex-row">
          <h1 className="text-2xl font-bold">{game.title}</h1>
          {user && (
            <div className="flex flex-row ml-auto gap-x-4">
              <AddToLibraryButton
                disabled={isInLibrary(game)}
                inLibrary={isInLibrary(game)}
                display="icon"
                game={game}
              />
              <HeartBtn isFavourite={isFavourite(game)} id={game.igdbId} />
            </div>
          )}
        </div>
        <h3 className="text-xl font-semibold text-muted-foreground">About</h3>
        {game?.summary && <GameSummary summary={game.summary} />}
        <div className="flex flex-col gap-y-2 gap-x-4 mt-2">
          <h3 className="text-lg font-semibold">Genres </h3>
          <div className="flex flex-row gap-2">
            {game?.genres.map((genre) => (
              <Badge className="text-foreground bg-accent-green" key={genre.id}>
                {genre.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-y-2 gap-x-4 my-4 flex-wrap">
          <h3 className="text-lg font-semibold">Platforms</h3>
          <div className="flex flex-row gap-y-2 gap-x-4">
            {game.platforms.map((platform) => (
              <Badge
                variant="secondary"
                className="bg-foreground text-muted"
                key={platform.id}
              >
                {platform.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-row gap-y-2 gap-x-8">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">Release Date</h3>
            <p className="text-muted-foreground text-sm">
              {game.releaseDate
                ? format(game.releaseDate, "dd MMM yyyy")
                : "Unknown"}
            </p>
          </div>
          <div className="flex flex-col gap-y-1">
            <h3 className="text-lg font-semibold">Age Rating</h3>
            {Array.isArray(game.ageRating) && game.ageRating.length > 0 ? (
              <div className="flex flex-col gap-y-2 text-muted-foreground text-sm">
                {game.ageRating.map((r) => (
                  <div key={r.id}>
                    {ratingCategories[r.ratingCategory] ?? "Unknown Rating"} (
                    {ratingOrganizations[r.organization] ?? "Unknown Org"})
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Not rated</p>
            )}
          </div>
          <div className="flex flex-col gap-y-2">
            <h3>User rating</h3>
            <GameRating rating={game.rating || null} />
          </div>
        </div>
        <div className="flex gap-x-12 flex-row">
          <div className="flex flex-col gap-1 my-4 flex-wrap">
            <h3 className="text-lg font-semibold">Developers</h3>
            {game.developer.map((developer) => {
              return (
                <p className="text-muted-foreground text-sm" key={developer.id}>
                  {developer.name}
                </p>
              );
            })}
          </div>
          <div className="flex flex-col gap-1 my-4 flex-wrap">
            <h3 className="text-lg font-semibold">Publishers</h3>
            {game.publisher.map((publisher) => {
              return (
                <p className="text-muted-foreground text-sm" key={publisher.id}>
                  {publisher.name}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[350px] flex flex-col gap-4">
        <img
          className="rounded-lg object-cover w-full h-auto"
          src={game.coverImage?.url.replace("t_thumb", "t_original")}
          alt="Game Cover"
        />
      </div>
    </TabsContent>
  );
}

function GameSummary({ summary }: { summary: string }) {
  const [expanded, setExpanded] = useState(false);
  const limit = 300;
  const isLong = summary.length > limit;

  const toggleExpanded = () => setExpanded((prev) => !prev);

  return (
    <div className="relative text-muted-foreground">
      <p>{expanded || !isLong ? summary : summary.slice(0, limit) + "..."}</p>
      {isLong && (
        <button
          onClick={toggleExpanded}
          className="mt-2 text-primary font-semibold hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
