import {
  createFileRoute,
  Navigate,
  Outlet,
  useMatchRoute,
} from "@tanstack/react-router";

export const Route = createFileRoute("/user")({
  component: RouteComponent,
});

function RouteComponent() {
  const match = useMatchRoute()({ to: "/user" });

  if (match) {
    return <Navigate to="/user/profile" />;
  }

  return <Outlet />;
}
