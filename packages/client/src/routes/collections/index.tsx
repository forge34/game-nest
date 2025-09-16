import { CollectionsQueries } from "@/api/collections";
import CollectionCard from "@/components/collections/collections-card";
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

export const Route = createFileRoute("/collections/")({
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
  const total = data?.count || 0;
  const filter = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const match = useMatchRoute();
  const isMatched = match({ to: "/collections" });
  const totalPages = Math.ceil(total / filter.limit) || 1;

  return (
    <>
      {!isMatched ? (
        <Outlet />
      ) : (
        <div className="flex flex-col px-12 py-5 gap-4">
          <div className="flex flex-row flex-wrap gap-2 md:gap-5 justify-start">
            {collections?.map((c) => (
              <CollectionCard
                collection={c}
                className="md:basis-[18%] lg:grow-0"
                key={c.id}
              />
            ))}
          </div>

          <Pagination
            currentPage={filter.page}
            totalPages={totalPages}
            onPageChange={(page) => navigate({ search: () => ({ page }) })}
          />
        </div>
      )}
    </>
  );
}
