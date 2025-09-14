import { getMe } from "@/api/auth";
import { getLibrary } from "@/api/games";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Separator } from "@/components/ui/separator";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { type QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

type MyRouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(getMe());
    if (data) {
      await context.queryClient.ensureQueryData(getLibrary());
    }

    return data;
  },
});

function RootComponent() {

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-[100dvh]">
        <Navbar />
        <Separator />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <TanStackRouterDevtools />
    </ThemeProvider>
  );
}
