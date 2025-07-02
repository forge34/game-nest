import { getMe } from "@/api/auth";
import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { type QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Globe, Home, Info, Library } from "lucide-react";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(getMe());
    useAuthStore.getState().setUser(data);

    return data;
  },
});

function RootComponent() {
  const user = useAuthStore((s) => s.user);

  return (
    <ThemeProvider>
      <nav className="flex flex-row py-2 border  px-4 items-center">
        <span className="flex flex-row justify-around w-full self-stretch">
          <h3 className="text-2xl font-logo">GameForge</h3>
          <span className="flex flex-row self-center ">
            <Button variant="link">
              <Home size={"1rem"} className="mx-2 my-auto" />
              <Link to="/">Home</Link>
            </Button>
          </span>
          <span className="flex flex-row self-center">
            <Button variant="link">
              <Globe size={"1rem"} className="mx-2 my-auto" />
              <Link to="/browse">Browse</Link>
            </Button>
          </span>
          <span className="flex flex-row self-center">
            <Button variant="link">
              <Library size={"1rem"} className="mx-2 my-auto" />
              <Link to="/library">My library</Link>
            </Button>
          </span>
          <span className="flex flex-row self-center">
            <Button variant="link">
              <Info size={"1rem"} className="mx-2 my-auto" />
              <Link to="/">About</Link>
            </Button>
          </span>
        </span>
        <span className="flex flex-row gap-4 ml-auto">
          {!user ? (
            <>
              <Button>
                <Link to="/login">Login</Link>
              </Button>
              <Button>
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
