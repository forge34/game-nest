import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import styles from "./root.module.css";
import Logo from "../assets/home.svg?react";
import Library from "../assets/library.svg?react";
import Search from "../assets/search.svg?react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className={styles.headerContainer}>
        <Link to="/" className="sidebar-link">
          <Logo className="icon" width={18} height={18} />
          Home
        </Link>
        <Link className={"sidebar-link"} to="/">
          <Search className="icon " width={18} height={18} />
          Browse Games
        </Link>
        <Link className={"sidebar-link"} to="/">
          <Library className="icon invert" width={18} height={18} />
          Library
        </Link>
      </div>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
