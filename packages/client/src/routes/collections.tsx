import { CollectionsQueries } from "@/api/collections";
import CollectionCard from "@/components/collections-card";
import Pagination from "@/components/pagination";
import { useGetCollections } from "@/lib/hooks/use-collections";
import {
  createFileRoute,
  useNavigate,
  useMatchRoute,
  Outlet,
} from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";

const CollectionPaginationSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(15),
});

export const Route = createFileRoute("/collections")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const collections = await context.queryClient.ensureQueryData(
      CollectionsQueries.getAll(),
    );

    return collections;
  },
  validateSearch: zodValidator(CollectionPaginationSchema),
});

function RouteComponent() {
  const { data } = useGetCollections();
  const collections = data?.collections;
  const count = data?.count || 0;
  const filter = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const match = useMatchRoute();
  const isMatched = match({ to: "/collections" });
  return (
    <>
      {!isMatched ? (
        <Outlet />
      ) : (
        <div className="flex flex-col py-6 px-8 gap-2">
          <div className="flex flex-row flex-wrap gap-4 justify-start">
            {collections?.map((c) => (
              <CollectionCard
                collection={c}
                className="flex-1/2 md:flex-1/3 lg:flex-1/4 lg:grow-0"
                key={c.id}
              />
            ))}
          </div>

          <Pagination
            totalItems={count}
            currentPage={filter.page}
            limit={filter.limit}
            onPageChange={(page) => navigate({ search: () => ({ page }) })}
          />
        </div>
      )}
    </>
  );
}
