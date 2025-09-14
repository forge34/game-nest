import { queryClient } from "@/api";
import {
  CollectionsMutations,
  CollectionsQueries,
  type CollectionPagination,
} from "@/api/collections";
import { router } from "@/main";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

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

function useUpdateCollection(id: string) {
  return useMutation({
    mutationFn: CollectionsMutations.updateCollection,
    onSuccess: () => {
      toast.success("Collection updated sucessfully");
      queryClient.invalidateQueries({ queryKey: ["collections", id] });
    },
  });
}

function useDeleteCollection(id: string) {
  return useMutation({
    mutationFn: CollectionsMutations.deleteCollection,
    onSuccess: () => {
      toast.success("Collection updated sucessfully");
      queryClient.invalidateQueries({ queryKey: ["collections", id] });
      router.navigate({ to: "/collections" });
    },
  });
}

function useCreateCollection() {
  return useMutation({
    mutationFn: CollectionsMutations.createCollection,
    onSuccess: () => {
      toast.success("Collection created sucessfully");
      queryClient.invalidateQueries({});
      router.navigate({ to: ".." });
    },
  });
}

function useAddGameToCollection(id: string) {
  return useMutation({
    mutationFn: CollectionsMutations.addGameToCollection,
    onSuccess: () => {
      toast.success("Game added to collection updated ");
      queryClient.invalidateQueries({ queryKey: ["collections", id] });
    },
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
