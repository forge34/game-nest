import type { GenresWithGames } from "@game-forge/shared";
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

interface GenreFilterProps {
  filters: GenresWithGames[];
  selectedGenres: string[];
  onChangeChecked: (selectedGenres: string[]) => void;
}

function GenreFilter({
  filters,
  selectedGenres,
  onChangeChecked,
}: GenreFilterProps) {
  function togglefilter(genre: string) {
    if (selectedGenres.includes(genre)) {
      onChangeChecked(selectedGenres.filter((g) => g !== genre));
    } else {
      onChangeChecked([...selectedGenres, genre]);
    }
  }

  return (
    <div className="flex flex-row w-full gap-x-8">
      <Popover>
        <PopoverTrigger>
          <Button variant="outline" className="text-md">
            Categories
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          {filters.map((genre) => (
            <div className="flex flex-row my-3">
              <p>{genre.name}</p>

              <Badge
                variant="outline"
                className="ml-auto mr-2 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
              >
                {genre.games.length}
              </Badge>
              <Checkbox
                checked={selectedGenres.includes(genre.name)}
                value={genre.name}
                onCheckedChange={() => togglefilter(genre.name)}
              />
            </div>
          ))}
        </PopoverContent>
      </Popover>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-md">
              Sort by
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Sort filters</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup>
              <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">
                Bottom
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default GenreFilter;
