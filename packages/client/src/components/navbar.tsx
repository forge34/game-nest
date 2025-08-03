import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { Link } from "@tanstack/react-router";
import { Home, Library, LogInIcon, Search } from "lucide-react";

function Navbar() {
  const user = useAuthStore((s) => s.user);

  return (
    <nav className="flex flex-row py-2 border  px-4 items-center">
      <span className="flex flex-row justify-around w-full self-stretch">
        <h3 className="text-2xl font-logo">GameNest</h3>
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
  );
}

export default Navbar;
