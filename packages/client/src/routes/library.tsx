import { getLibrary } from "@/api/games";
import { createFileRoute } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useLibrary from "@/lib/hooks/use-library";
import { Badge } from "@/components/ui/badge";
import type { Game, Library } from "@game-forge/shared";
import { useState } from "react";
export const Route = createFileRoute("/library")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(getLibrary());

    return data;
  },
});

function RouteComponent() {
  const { library, countFavourites } = useLibrary();
  const [selectedGameId, setSelectedGameId] = useState<number>(
    library[0].gameId,
  );

  console.log(library);
  const selectedGame = library.find((g) => g.gameId === selectedGameId);

  if (!selectedGame) return <p>Invalid selected game</p>;

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl py-3 px-5">
      <div className=" flex flex-row w-full gap-4">
        <div>
          <Accordion
            className="bg-card border rounded-md py-2 px-4"
            type="multiple"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex flex-row justify-between items-center">
                  <h3 className="text-lg font-semibold">Favourites</h3>
                  <Badge
                    variant="outline"
                    className="ml-auto mr-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                  >
                    {countFavourites()}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>Test</AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="flex flex-row justify-between items-center">
                  <h3 className="text-lg font-semibold">All games</h3>
                  <Badge
                    variant="outline"
                    className="ml-auto mr-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                  >
                    {library.length}
                  </Badge>
                </div>
              </AccordionTrigger>

              <AccordionContent className="flex flex-col max-h-[600px]">
                {library.map((game) => (
                  <Item
                    key={game.gameId}
                    game={game.game}
                    selected={selectedGameId === game.game.id}
                    onSelect={() => setSelectedGameId(game.game.id)}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <GameDetails game={selectedGame} />
      </div>
    </div>
  );
}

function Item({
  game,
  selected,
  onSelect,
}: {
  game: Game;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`flex flex-row items-center space-x-3 px-2 py-1 rounded-md transition-colors ${
        selected
          ? "bg-card-foreground/5 text-accent-foreground"
          : "hover:bg-card-foreground/5"
      }`}
    >
      <img
        src={game.coverImage?.url.replace("t_thumb", "t_cover_small")}
        alt={game.title}
        className="w-[40px] h-[60px] object-cover rounded-md shadow-sm"
      />
      <h3 className="text-sm font-medium truncate w-[140px] text-left">
        {game.title}
      </h3>
    </button>
  );
}

function GameDetails({ game }: { game: Library[number] }) {
  const gameCover = game.game.coverImage?.url.replace("t_thumb", "t_original");
  return (
    <div className="flex flex-col bg-card/90 border py-3 px-6 rounded-md gap-2 backdrop-blur-lg">
      <div className="flex flex-row gap-4">
        <img src={gameCover} className="w-[14rem] rounded-md" />
        <div className="flex flex-col">
          <h3 className="text-4xl font-semibold">{game.game.title}</h3>
          <h3 className="text-lg text-muted-foreground font-semibold">About</h3>
          <GameSummary summary={game.game.summary || ""} />
        </div>
      </div>
      <div className="flex flex-col mt-4">
        <h3 className="text-4xl font-semibold">Stats </h3>
        <div className="flex flex-row gap-6 mt-4">
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold">Hours played</h3>
            <p>{game.hoursPlayed}</p>
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold">Completion</h3>
            <p>{game.completion}%</p>
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold">Rating</h3>
            <p>{game.rating}</p>
          </div>
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold">Hours played</h3>
            <p>{game.hoursPlayed}</p>
          </div>
        </div>
      </div>
    </div>
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
