import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import useMedia, { media } from "@/lib/hooks/use-media";
import { Link } from "@tanstack/react-router";
import {
  Home,
  Library,
  LogInIcon,
  Menu,
  Search,
  User as Avatar,
  Settings,
  LogOut,
  SquareStack,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import type { User } from "@game-forge/shared";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./user-avatar";
import useUser from "@/lib/hooks/use-user";

function Navbar() {
  const { user } = useUser();
  const isLarge = useMedia(media.lg);

  return (
    <>
      {isLarge ? <NavbarDesktop user={user} /> : <NavbarMobile user={user} />}
    </>
  );
}

function UserMenu({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <UserAvatar avatarUrl={user.avatarUrl} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        className="bg-card py-2 w-48 rounded-md border shadow-md"
      >
        <DropdownMenuItem
          className="flex items-center gap-2 px-3 py-2 text-sm"
          asChild
        >
          <Link to="/user/$username/profile" params={{ username: user.name }}>
            <Avatar className="w-5 h-5" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AuthSection({
  user,
  isLarge,
}: {
  user?: User | null;
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

function NavbarDesktop({ user }: { user?: User | null }) {
  return (
    <nav>
      <div className="flex py-2 border px-4 gap-2 items-center justify-between flex-wrap">
        <h3 className="text-2xl font-logo">GameNest</h3>

        <span className="flex flex-row self-center">
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

        <span className="flex flex-row self-center">
          <Button variant="link" asChild>
            <Link to="/collections">
              <SquareStack size={"1rem"} className="mx-2 my-auto" />
              Collections
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

        <span className="flex gap-2">
          <AuthSection user={user} isLarge />
          {user && <UserMenu user={user} />}
          <ModeToggle />
        </span>
      </div>
    </nav>
  );
}

function NavbarMobile({ user }: { user?: User | null }) {
  return (
    <nav>
      <Collapsible
        className="flex py-2 border px-4 items-center gap-2 justify-between flex-wrap"
        openOnClick
      >
        <h3 className="text-2xl font-logo">GameNest</h3>

        <span className="flex flex-row self-center">
          <Button variant="link" asChild>
            <Link to="/discover">
              <Search size={"1rem"} className="mx-2 my-auto" />
              Discover
            </Link>
          </Button>
        </span>

        <CollapsibleTrigger>
          <Button variant="outline" size="icon">
            <Menu />
          </Button>
        </CollapsibleTrigger>
        <ModeToggle />

        <CollapsibleContent className="flex flex-col gap-4 mr-auto data-[state=open]:animate-expand data-[state=closed]:animate-collapse">
          {!user ? (
            <div className="flex flex-col gap-2 mt-2">
              <Link to="/login">Login</Link>
              <Link to="/signup">Create Account</Link>
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap">
              <Button asChild variant="outline">
                <Link to="/user/$username/profile" params={{ username: user.name }}>
                  <Avatar />
                  Profile
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to=".">
                  <Settings />
                  Settings
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/collections">
                  <SquareStack />
                  Collections
                </Link>
              </Button>

              <Button asChild variant="outline">
                <Link to="/library">
                  <Library />
                  My library
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/library">
                  <LogOut />
                  Logout
                </Link>
              </Button>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </nav>
  );
}

export default Navbar;
