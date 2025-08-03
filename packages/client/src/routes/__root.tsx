import { queryClient } from "@/api";
import { getMe } from "@/api/auth";
import { getLibrary } from "@/api/games";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/auth";
import type { User } from "@game-forge/shared";
import { type QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";

type MyRouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(getMe());
    if (data) {
      await context.queryClient.ensureQueryData(getLibrary());
    }

    return data;
  },
});

function RootComponent() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const query = getMe();
  const me = queryClient.getQueryData<User>(query.queryKey);

  useEffect(() => {
    if (!user && me) {
      setUser(me);
    }
  }, [user, me, setUser]);
  return (
    <ThemeProvider>
      <Navbar />
      <Separator/>
      <Outlet />
      <Footer />
      <TanStackRouterDevtools />
    </ThemeProvider>
  );
}
