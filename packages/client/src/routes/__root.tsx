import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-proivder";
import { Button } from "@/components/ui/button";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Globe, Home, Info, Library } from "lucide-react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
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
          <Button>
            <Link to="/">Login</Link>
          </Button>
          <Button>
            <Link to="/">Create Account</Link>
          </Button>
          <ModeToggle />
        </span>
      </nav>
      <Outlet />
      <TanStackRouterDevtools />
    </ThemeProvider>
  );
}
