import { CollectionsQueries } from "@/api/collections";
import HoverCard from "@/components/hover-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UserProfileLink from "@/components/user-profile-link";
import { useGetCollectionById } from "@/lib/hooks/use-collections";
import useMedia from "@/lib/hooks/use-media";
import useUser from "@/lib/hooks/use-user";
import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
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
  const { user: authUser } = useUser();
  const mediaMatch = useMedia("(width >= 48rem)");
  const navigate = useNavigate();

  if (!data) {
    return null;
  }
  const games = data.games;
  const user = data.user;
  return (
    <div className="flex flex-col gap-3 py-6 px-12">
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-col gap-4">
          <h1 className="font-semibold text-4xl ">{data.name}</h1>
          <p className="font-light text-muted-foreground h-full">
            {data.description ?? "No description"}
          </p>
          <div className="min-w-full">
            <Outlet />
          </div>
        </div>
        <div className="flex flex-col gap-2 md:ml-auto py-2 px-4 border rounded-md">
          <UserProfileLink avatarUrl={user.avatarUrl} username={user.name} />
          <span className="flex flex-row text-sm text-muted-foreground justify-between">
            <p>Created at</p>
            <p>{format(data.createdAt, "yyyy-MM-dd")}</p>
          </span>
          <span className="flex flex-row text-sm text-muted-foreground justify-between">
            <p>Last updated at</p>
            <p>{format(data.updatedAt, "yyyy-MM-dd")}</p>
          </span>
          <p className="text-sm text-muted-foreground">{games.length} Games</p>
          {authUser && (
            <>
              <Button asChild>
                <Link to="./edit" from={Route.path}>
                  Edit Collection
                </Link>
              </Button>
              <Button asChild>
                <Link to="./add-game" from={Route.path}>
                  Add a game to collection
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
      <Separator />
      <div className="flex flex-row flex-wrap gap-4">
        {games.map((game) => (
          <HoverCard
            game={game}
            className="basis-[30%] lg:basis-[12%]"
            key={game.id}
            onClick={() => {
              if (!mediaMatch) {
                navigate({
                  to: "/discover/$gameId",
                  params: { gameId: game.id.toString() },
                });
              }
            }}
          >
            <span className="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center text-sm font-semibold text-white">
              {game.title}
              <Button asChild>
                <Link
                  to="/discover/$gameId"
                  params={{ gameId: game.id.toString() }}
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
