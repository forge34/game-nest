import { searchGame } from "@/api/games";
import SearchInput from "@/components/search-input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useAddGameToCollection } from "@/lib/hooks/use-collections";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const SearchScema = z.object({
  term: z.string().default(""),
});

export const Route = createFileRoute("/collections/$collectionId/add-game")({
  component: RouteComponent,
  validateSearch: zodValidator(SearchScema),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { collectionId } = Route.useParams();
  const { term } = Route.useSearch();
  const [debounced] = useDebounce(term, 800);
  const { data } = useQuery(searchGame(debounced));
  const add = useAddGameToCollection(collectionId);
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="bg-accent hover:bg-accent/85 transition-colors">Search game</Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="bg-card p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SearchInput
          name="game-search"
          value={term}
          className="bg-card focus:outline1 w-full"
          onChange={(e) =>
            navigate({ to: ".", search: { term: e.target.value } })
          }
        />

        {data?.map((g) => (
          <div
            key={g.id}
            onClick={() => {
              add.mutate({ id: collectionId, gameId: g.id });
              setOpen(false);
              navigate({ to: ".", search: { term: "" } });
            }}
            className="
    flex flex-row items-center gap-3
    px-2 py-1.5 rounded-md cursor-pointer
    transition-colors
    hover:bg-accent hover:text-accent-foreground
  "
          >
            <img src={g.coverUrl} className="w-9 h-full rounded-md" />
            <p className="text-sm font-light truncate">{g.title}</p>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
