import {
  CollectionsMutations,
  CollectionsQueries,
  type CollectionPagination,
} from "@/api/collections";
import { useMutation, useQuery } from "@tanstack/react-query";

function useGetCollectionById(id: string) {
  const { data, isPending, isSuccess, isError } = useQuery(
    CollectionsQueries.getById(id),
  );
  return { data, isPending, isError, isSuccess };
}

function useGetCollections(filters?: Partial<CollectionPagination>) {
  const { data, isError, isPending, isSuccess } = useQuery(
    CollectionsQueries.getAll(filters),
  );
  return { data, isError, isPending, isSuccess };
}

function useGetUserCollections(userId: string) {
  const { data, isError, isSuccess, isPending } = useQuery(
    CollectionsQueries.getUserCollections(userId),
  );

  return { data, isError, isSuccess, isPending };
}

type CollectionInput = {
  name: string;
  description: string;
};
function useUpdateCollection(
  id: string,
  { name, description }: CollectionInput,
) {
  const mutation = useMutation({
    mutationFn: () =>
      CollectionsMutations.updateCollection(id, name, description),
  });

  return mutation;
}

function useDeleteCollection(id: string) {
  const mutation = useMutation({
    mutationFn: () => CollectionsMutations.deleteCollection(id),
  });

  return mutation;
}

function useCreateCollection({ name, description }: CollectionInput) {
  const mutation = useMutation({
    mutationFn: () => CollectionsMutations.createCollection(name, description),
  });

  return mutation;
}

function useAddGameToCollection(id: string, gameId: string) {
  const mutation = useMutation({
    mutationFn: () => CollectionsMutations.addGameToCollection(id, gameId),
  });

  return mutation;
}

function useRemoveGameToCollection(id: string, gameId: string) {
  const mutation = useMutation({
    mutationFn: () => CollectionsMutations.removeGameFromCollection(id, gameId),
  });

  return mutation;
}

export {
  useGetCollectionById,
  useGetCollections,
  useGetUserCollections,
  useUpdateCollection,
  useCreateCollection,
  useAddGameToCollection,
  useRemoveGameToCollection,
  useDeleteCollection,
};
