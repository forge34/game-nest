import { getUserById } from "@/api/user";

import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Star,
  Play,
  Check,
  Clock,
  XCircle,
  LibraryBig,
  Heart,
  Pencil,
} from "lucide-react";

export const Route = createFileRoute("/user/$username/profile")({

  component: RouteComponent,
});

function RouteComponent() {
  // const { user: authUser } = useUser();
  const { username } = Route.useParams();
  const { data: user } = useQuery(getUserById(username));
  if (!user) return null;

  const totalGames = user.library.length;
  const completedGames = user.library.filter(
    (g) => g.status === "Completed",
  ).length;
  const playingGames = user.library.filter(
    (g) => g.status === "Playing",
  ).length;
  const backlogGames = user.library.filter(
    (g) => g.status === "Backlog",
  ).length;
  const droppedGames = user.library.filter(
    (g) => g.status === "Dropped",
  ).length;
  const totalHours = user.library.reduce((acc, g) => acc + g.hoursPlayed, 0);
  const favoriteGames = user.library.filter((g) => g.favorite).length;
  const reviewsCount = user.reviews.length;
  const averageRating =
    user.library.reduce((acc, g) => acc + (g.rating || 0), 0) / totalGames || 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
      <StatCard
        icon={<Check />}
        iconColor="text-green-500"
        title="Completed"
        value={completedGames}
      />
      <StatCard
        icon={<Play />}
        iconColor="text-blue-500"
        title="Playing"
        value={playingGames}
      />
      <StatCard
        icon={<LibraryBig />}
        iconColor="text-orange-500"
        title="Backlog"
        value={backlogGames}
      />
      <StatCard
        icon={<Heart />}
        iconColor="text-red-600"
        title="Favorites"
        value={favoriteGames}
      />
      <StatCard
        icon={<Star />}
        iconColor="text-amber-500"
        title="Avg Rating"
        value={averageRating.toFixed(2)}
      />
      <StatCard
        icon={<Pencil />}
        iconColor="text-teal-500"
        title="Total Reviews"
        value={reviewsCount}
      />
      <StatCard
        icon={<Clock />}
        iconColor="text-purple-500"
        title="Total Hours"
        value={totalHours}
      />
      <StatCard
        icon={<XCircle />}
        iconColor="text-red-500"
        title="Dropped"
        value={droppedGames}
      />
    </div>
  );
}

function StatCard({
  icon,
  iconColor = "text-primary",
  title,
  value,
}: {
  icon: React.ReactNode;
  iconColor?: string;
  title: string;
  value: number | string;
}) {
  return (
    <div className="flex flex-col items-center p-4 bg-card rounded-md border shadow hover:shadow-primary/20 transition-shadow">
      <div className={`${iconColor} mb-2`}>{icon}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-muted-foreground text-sm">{title}</div>
    </div>
  );
}
