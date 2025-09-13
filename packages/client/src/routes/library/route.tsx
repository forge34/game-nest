import { getLibrary } from "@/api/games";
import HoverCard from "@/components/hover-card";
import { Button } from "@/components/ui/button";
import useLibrary from "@/lib/hooks/use-library";
import useMedia from "@/lib/hooks/use-media";
import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";

export const Route = createFileRoute("/library")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(getLibrary());

    return data;
  },
});

function RouteComponent() {
  const { library } = useLibrary();
  const mediaMatch = useMedia("(width >= 48rem)");
  const navigate = useNavigate();
  return (
    <div className="relative flex flex-col w-full h-full overflow-hidden rounded-xl py-3 px-5 gap-4">
      <h3 className="text-2xl font-semibold">My library</h3>
      <div className=" flex flex-row flex-wrap justify-between md:justify-center w-full gap-3">
        {library.map((g) => {
          const game = g.game;
          return (
            <HoverCard
              game={game}
              onClick={() => {
                if (!mediaMatch) {
                  navigate({
                    to: "/library/$gameId/edit",
                    params: { gameId: game.id.toString() },
                  });
                }
              }}
              className="basis-[30%] md:basis-[14%] border"
            >
              {mediaMatch && (
                <div className="flex flex-col absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                  <span className="text-sm text-center  font-semibold text-white">
                    {game.title}
                  </span>

                  <Button variant="secondary" className="self-center" size="sm">
                    <Link
                      to="/library/$gameId/edit"
                      params={{ gameId: game.id.toString() }}
                    >
                      View details
                    </Link>
                  </Button>
                </div>
              )}
            </HoverCard>
          );
        })}
      </div>
      <Outlet />
    </div>
  );
}
