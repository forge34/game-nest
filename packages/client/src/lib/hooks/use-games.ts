import { getAllGames } from "@/api/games";
import type { FilterState } from "@gridcollect/shared";
import { useQuery } from "@tanstack/react-query";

function useGames(searchParams?: Partial<FilterState>) {
  const { data, isLoading, isError, isFetching } = useQuery(
    getAllGames(searchParams),
  );

  const games = data?.games || [];
  const total = data?.total || 0;
  return { games, isError, isLoading, total, isFetching };
}

export default useGames;
