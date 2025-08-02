import { getLibrary } from "@/api/games";
import GameCard from "@/components/library-card/card";
import useLibrary from "@/lib/hooks/use-library";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/library")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(getLibrary());

    return data;
  },
});

function RouteComponent() {
  const { library } = useLibrary();
  return (
    <div className="relative flex flex-col w-full h-full overflow-hidden rounded-xl py-3 px-5 gap-4">
      <h3 className="text-2xl font-semibold">My library</h3>
      <div className=" flex flex-row flex-wrap justify-center w-full gap-6">
        {library.map((g) => {
          return <GameCard g={g} key={g.game.igdbId.toString()} />;
        })}
      </div>
    </div>
  );
}
