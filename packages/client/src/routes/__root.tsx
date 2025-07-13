import { queryClient } from "@/api";
import { getMe } from "@/api/auth";
import { getLibrary } from "@/api/games";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import type { User } from "@game-forge/shared";
import { type QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Home, Info, Library, LogInIcon, Search } from "lucide-react";
import { useEffect } from "react";

type MyRouterContext = {
  queryClient: QueryClient;
}

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
      <nav className="flex flex-row py-2 border  px-4 items-center">
        <span className="flex flex-row justify-around w-full self-stretch">
          <h3 className="text-2xl font-logo">GameForge</h3>
          <span className="flex flex-row self-center ">
            <Button variant="link" asChild>
              <Link to="/">
                <Home size={"1rem"} className="mx-2 my-auto" />
                Home
              </Link>
            </Button>
          </span>
          <span className="flex flex-row self-center">
            <Button variant="link" asChild>
              <Link to="/discover">
                <Search size={"1rem"} className="mx-2 my-auto" />
                Discover
              </Link>
            </Button>
          </span>
          {user && (
            <span className="flex flex-row self-center">
              <Button variant="link" asChild>
                <Link to="/library">
                  <Library size={"1rem"} className="mx-2 my-auto" />
                  My library
                </Link>
              </Button>
            </span>
          )}
          <span className="flex flex-row self-center">
            <Button variant="link" asChild>
              <Link to="/">
                <Info size={"1rem"} className="mx-2 my-auto" />
                About
              </Link>
            </Button>
          </span>
        </span>
        <span className="flex flex-row gap-4 ml-auto">
          {!user ? (
            <>
              <Button asChild>
                <Link to="/login">
                  <LogInIcon />
                  Login
                </Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Create Account</Link>
              </Button>
            </>
          ) : (
            <>
              <Button>Logout</Button>
            </>
          )}
          <ModeToggle />
        </span>
      </nav>
      <Outlet />
      <TanStackRouterDevtools />
    </ThemeProvider>
  );
}
