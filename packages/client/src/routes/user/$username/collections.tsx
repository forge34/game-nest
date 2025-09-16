import { getUserById } from "@/api/user";
import CollectionCard from "@/components/collections/collections-card";
import { Button } from "@/components/ui/button";
import useUser from "@/lib/hooks/use-user";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/user/$username/collections")({
  component: RouteComponent,
});

function RouteComponent() {
  const { username } = Route.useParams();
  const { data: user } = useQuery(getUserById(username));
  const { user: authUser } = useUser();
  if (!user) {
    return null;
  }

  const collections = user.collections;
  return (
    <div className="flex flex-col gap-4">
      {authUser?.id === user.id && (
        <Button className="self-start" asChild>
          <Link to="./add" from={Route.fullPath}>
            <Plus /> Add collection
          </Link>
        </Button>
      )}
      <div className="flex flex-row flex-wrap gap-4">
        {collections.map((c) => {
          return (
            <CollectionCard key={c.id} className="" collection={c} showEmpty />
          );
        })}
      </div>
      <Outlet />
    </div>
  );
}
