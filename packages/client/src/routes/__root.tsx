import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import styles from "./root.module.css";
import Home from "../assets/home.svg?react";
import Library from "../assets/library.svg?react";
import Search from "../assets/search.svg?react";
import Logo from "../../public/logo.png";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className={styles.headerContainer}>
        <div className="website-name">
          <img src={Logo} width={48} />
          <h1>GameForge</h1>
        </div>
        <Link
          to="/"
          className={styles.sidebarLink}
          activeProps={{
            style: {
              // backgroundColor: "var(--color-secondary)",
            },
          }}
        >
          <Home className="icon" width={18} height={18} />
          Home
        </Link>
        <Link
          className={styles.sidebarLink}
          to="/browse"
          activeProps={{
            style: {
              backgroundColor: "var(--color-secondary)",
            },
          }}
        >
          <Search className="icon " width={18} height={18} />
          Browse Games
        </Link>
        <Link
          className={styles.sidebarLink}
          to="/library"
          activeProps={{
            style: {
              backgroundColor: "var(--color-secondary)",
            },
          }}
        >
          <Library className="icon invert" width={18} height={18} />
          Library
        </Link>
      </div>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
