import { Card, CardContent } from "@/components/ui/card";
import UserAvatar from "@/components/user-avatar";
import { useAuthStore } from "@/store/auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

const padLength = 2;
function RouteComponent() {
  const user = useAuthStore((s) => s.user);
  const completed = user?.library.filter((g) => g.status === "Completed");
  const playing = user?.library.filter((g) => g.status === "Playing");

  return (
    <div className="flex flex-col m-4 gap-4">
      <div className="mx-auto flex flex-col gap-2">
        <UserAvatar className="mx-auto border" user={user} size={160} />
        <h3 className="text-2xl font-semibold ">{user?.name}</h3>
      </div>

      <div className="flex gap-4">
        <Card className="w-96 mb-8 bg-card border-border/50 shadow-lg shadow-primary/5">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              About Me
            </h2>
            <p className="text-muted-foreground leading-relaxed text-wrap">
              Passionate gamer exploring virtual worlds since 2010. Love RPGs,
              indie games, and competitive shooters. Always hunting for hidden
              gems and building the ultimate game collection.
            </p>
          </CardContent>
        </Card>
        <Card className="flex-2 h-fit border-border/50 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/10">
          <CardContent className="p-6 ">
            <div className="flex  items-center gap-4 justify-between mb-4">
              <div>
                <h1 className="text-4xl text-center font-semibold">
                  {user?.library.length.toString().padStart(padLength, "0")}
                </h1>

                <h3 className="text-md text-muted-foreground">Total games</h3>
              </div>
              <div>
                <h1 className="text-4xl text-center font-semibold">
                  {completed?.length.toString().padStart(padLength, "0")}
                </h1>

                <h3 className="text-md text-muted-foreground">
                  Total games completed
                </h3>
              </div>
              <div>
                <h1 className="text-4xl text-center font-semibold">
                  {playing?.length.toString().padStart(padLength, "0")}
                </h1>

                <h3 className="text-md text-muted-foreground">
                  Currently playing
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1 h-fit border-border/50 hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/10">
          <CardContent className="p-6 ">
            <div className="flex  items-center gap-4 justify-between mb-4 ">
              <div className="mx-auto">
                <h1 className="text-4xl text-center font-semibold ">
                  {"12".padStart(padLength, "0")}
                </h1>

                <h3 className="text-lg text-muted-foreground ">Total collections</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
