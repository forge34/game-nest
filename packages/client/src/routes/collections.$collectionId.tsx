import { CollectionsQueries } from "@/api/collections";
import HoverCard from "@/components/hover-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/user-avatar";
import { useGetCollectionById } from "@/lib/hooks/use-collections";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";

export const Route = createFileRoute("/collections/$collectionId")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(
      CollectionsQueries.getById(params.collectionId),
    );
    return data;
  },
});

function RouteComponent() {
  const { data } = useGetCollectionById(Route.useParams().collectionId);

  if (!data) {
    return null;
  }
  const games = data.games;
  const user = data.user;
  return (
    <div className="flex flex-col gap-3 py-6 px-12">
      <div className="flex flex-row">
        <div className="flex flex-col gap-4">
          <h1 className="font-semibold text-4xl ">{data.name}</h1>
          <p className="font-light text-muted-foreground">{data.description ?? "No description"}</p>
        </div>
        <div className="flex flex-col gap-2 ml-auto py-2 px-4 border rounded-md">
          <div className="flex flex-rowc items-center gap-2">
            <UserAvatar avatarUrl={user.avatarUrl} size={48} />
            <h5 className="text-md font-semibold">{user.name}</h5>
          </div>
          <span className="flex flex-row text-sm text-muted-foreground justify-between">
            <p>Created at</p>
            <p>{format(data.createdAt, "yyyy-MM-dd")}</p>
          </span>
          <span className="flex flex-row text-sm text-muted-foreground justify-between">
            <p>Last updated at</p>
            <p>{format(data.updatedAt, "yyyy-MM-dd")}</p>
          </span>
          <Button>Edit Collection</Button>
        </div>
      </div>
      <Separator />
      <div className="flex flex-row flex-wrap gap-4">
        {games.map((game) => (
          <HoverCard game={game} className="basis-[12%]">
            <span className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center text-lg font-semibold text-white">
              {game.title}
              <Button>
                <Link
                  to="/discover/$gameId"
                  params={{ gameId: game.igdbId.toString() }}
                >
                  Check game
                </Link>
              </Button>
            </span>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}
