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

function useUpdateCollection() {
  return useMutation({
    mutationFn: CollectionsMutations.updateCollection,
  });
}

function useDeleteCollection() {
  return useMutation({ mutationFn: CollectionsMutations.deleteCollection });
}

function useCreateCollection() {
  return useMutation({
    mutationFn: CollectionsMutations.createCollection,
  });
}

function useAddGameToCollection() {
  return useMutation({
    mutationFn: CollectionsMutations.addGameToCollection,
  });
}

function useRemoveGameToCollection() {
  return useMutation({
    mutationFn: CollectionsMutations.removeGameFromCollection,
  });
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
