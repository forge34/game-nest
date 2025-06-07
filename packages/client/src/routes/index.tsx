import { createFileRoute } from "@tanstack/react-router";
import styles from "./index.module.css";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className={styles.container}> </div>;
}
