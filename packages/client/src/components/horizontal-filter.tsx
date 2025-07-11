import type { GenresWithGames, PlatformWithGames } from "@game-forge/shared";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, ListFilter } from "lucide-react";

const sortOptions = [
  { label: "A - Z", value: "az" },
  { label: "Z - A", value: "za" },
  { label: "Release date", value: "rel_date" },
  { label: "Rating", value: "rating" },
] as const;

export type SortOptions = (typeof sortOptions)[number]["value"];

export interface FilterState {
  genres: string[];
  platforms: string[];
  sort: string;
}

interface GenreFilterProps {
  filters: { genres: GenresWithGames[]; platforms: PlatformWithGames[] };
  state: FilterState;
  onChangeChecked: (fs: FilterState) => void;
}

function GenreFilter({ filters, state, onChangeChecked }: GenreFilterProps) {
  function togglefilter(type: keyof FilterState, value: string) {
    if (type === "sort") {
      onChangeChecked({ ...state, sort: value });
      return;
    }

    const currentFilters = state[type] as string[];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter((v) => v !== value)
      : [...currentFilters, value];

    onChangeChecked({ ...state, [type]: newFilters });
  }

  return (
    <div className="flex flex-row w-full gap-x-8 mt-4">
      <Popover>
        <PopoverTrigger>
          <Button variant="outline" className="text-md">
            <Filter />
            Genres
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          {filters.genres.map((genre) => (
            <div className="flex flex-row my-3" key={genre.igdbId}>
              <p>{genre.name}</p>

              <Badge
                variant="outline"
                className="ml-auto mr-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
              >
                {genre.games.length}
              </Badge>
              <Checkbox
                checked={state.genres.includes(genre.name)}
                value={genre.name}
                onCheckedChange={() => togglefilter("genres", genre.name)}
              />
            </div>
          ))}
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger>
          <Button variant="outline" className="text-md">
            <Filter />
            Platforms
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          {filters.platforms.map((platform) => (
            <div className="flex flex-row my-3" key={platform.igdbId}>
              <p>{platform.name}</p>

              <Badge
                variant="outline"
                className="ml-auto mr-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
              >
                {platform.games.length}
              </Badge>
              <Checkbox
                checked={state.platforms.includes(platform.name)}
                value={platform.name}
                onCheckedChange={() => togglefilter("platforms", platform.name)}
              />
            </div>
          ))}
        </PopoverContent>
      </Popover>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-md">
              <ListFilter />
              Sort by
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Sort filters</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              onValueChange={(v) => togglefilter("sort", v)}
            >
              {sortOptions.map((t) => {
                return (
                  <DropdownMenuRadioItem value={t.value} key={t.value}>
                    {t.label}
                  </DropdownMenuRadioItem>
                );
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default GenreFilter;
