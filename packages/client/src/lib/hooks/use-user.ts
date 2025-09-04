import { getMe } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";

function useUser() {
  const { data : user } = useQuery(getMe());

  return { user };
}

export default useUser;
