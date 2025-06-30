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
        <span className="flex flex-row justify-around w-full">
          <span className="flex flex-row">
            <Home size={"1rem"} className="mx-2" />
            <Link to="/">Home</Link>
          </span>
          <span className="flex flex-row">
            <Globe size={"1rem"} className="mx-2" />
            <Link to="/">Browse</Link>
          </span>
          <span className="flex flex-row">
            <Library size={"1rem"} className="mx-2" />
            <Link to="/">My library</Link>
          </span>
          <span className="flex flex-row">
            <Info size={"1rem"} className="mx-2" />
            <Link to="/">About</Link>
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
      <Outlet/>
      <TanStackRouterDevtools />
    </ThemeProvider>
  );
}
