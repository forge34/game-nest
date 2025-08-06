import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import useMedia, { media } from "@/lib/hooks/use-media";
import { useAuthStore } from "@/store/auth";
import { Link } from "@tanstack/react-router";
import { Home, Library, LogInIcon, Menu, Search } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import type { User } from "@game-forge/shared";
import { cn } from "@/lib/utils";

function Navbar() {
  const user = useAuthStore((s) => s.user);
  const isLarge = useMedia(media.lg);

  return (
    <nav>
      <Collapsible
        className="flex py-2 border  px-4 items-center justify-between flex-wrap"
        openOnClick
      >
        <h3 className="text-2xl font-logo">GameNest</h3>
        {isLarge && (
          <span className="flex flex-row self-center ">
            <Button variant="link" asChild>
              <Link to="/">
                <Home size={"1rem"} className="mx-2 my-auto" />
                Home
              </Link>
            </Button>
          </span>
        )}
        <span className="flex flex-row self-center">
          <Button variant="link" asChild>
            <Link to="/discover">
              <Search size={"1rem"} className="mx-2 my-auto" />
              Discover
            </Link>
          </Button>
        </span>
        {user && isLarge && (
          <span className="flex flex-row self-center">
            <Button variant="link" asChild>
              <Link to="/library">
                <Library size={"1rem"} className="mx-2 my-auto" />
                My library
              </Link>
            </Button>
          </span>
        )}

        {!isLarge && (
          <CollapsibleTrigger>
            <Button variant="outline" size="icon">
              <Menu />
            </Button>
          </CollapsibleTrigger>
        )}
        <span className=" flex gap-2">
          {isLarge && <AuthSection user={user} isLarge={isLarge} />}
          <ModeToggle />
        </span>

        <CollapsibleContent className="flex flex-col gap-4 mr-auto data-[state=open]:animate-expand data-[state=closed]:animate-collapse">
          {!isLarge && <AuthSection user={user} isLarge={isLarge} />}
        </CollapsibleContent>
      </Collapsible>
    </nav>
  );
}

function AuthSection({
  user,
  isLarge,
}: {
  user: User | null;
  isLarge: boolean;
}) {
  return (
    <>
      {!user ? (
        <div className={cn("flex gap-x-2", !isLarge ? "flex-col" : "")}>
          <Button asChild variant={isLarge ? "default" : "ghost"}>
            <Link to="/login">
              {isLarge && <LogInIcon className="mr-2" />}
              Login
            </Link>
          </Button>
          <Button asChild variant={isLarge ? "default" : "ghost"}>
            <Link to="/signup">Create Account</Link>
          </Button>
          {!isLarge && (
            <Button asChild variant="ghost">
              <Link to="/library">My library</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className={cn("flex gap-x-2", !isLarge ? "flex-col" : "")}>
          <Button variant={isLarge ? "default" : "ghost"}>Logout</Button>
          {!isLarge && (
            <Button asChild variant="ghost">
              <Link to="/library">My library</Link>
            </Button>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;
