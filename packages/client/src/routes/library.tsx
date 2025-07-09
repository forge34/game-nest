import { getLibrary } from "@/api/games";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/library")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(getLibrary());

    return data;
  },
});

function RouteComponent() {
  const { data } = useQuery(getLibrary());

  console.log(data);
  return <div>Hello "/library"!</div>;
}
