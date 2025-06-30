import GenreFilter from "@/components/horizontal-filter";
import type { GenresWithGames } from "@game-forge/shared";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/browse")({
  component: RouteComponent,
  loader: async (): Promise<GenresWithGames[]> => {
    const res = await fetch(`${import.meta.env.VITE_API}/genres`, {
      mode: "cors",
    });

    return await res.json();
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  function onFilter(genres: string[]) {
    setSelectedGenres(genres);
  }

  return (
    <div className="flex flex-row mx-6 my-4 ">
      <GenreFilter
        filters={data}
        selectedGenres={selectedGenres}
        onChangeChecked={onFilter}
      />
    </div>
  );
}
