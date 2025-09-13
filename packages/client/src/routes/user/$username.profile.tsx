import { queryClient } from "@/api";
import { getUserById, uploadProfilePic } from "@/api/user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/user-avatar";
// import useUser from "@/lib/hooks/use-user";
import type { User } from "@game-forge/shared";
import { Label } from "@radix-ui/react-label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Camera,
  Star,
  Play,
  Check,
  Clock,
  XCircle,
  LibraryBig,
  Heart,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/user/$username/profile")({
  beforeLoad: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(
      getUserById(params.username),
    );

    return data;
  },
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
    <div className="flex flex-col m-4 gap-4">
      <div className="flex flex-row gap-2">
        <Button>Profile</Button>
        <Button>User's Collections</Button>
        <Button>Reviews</Button>
      </div>

      <div className="flex flex-row gap-6 items-start self-center">
        <ProfilePicture user={user} />
      </div>

      <div className="max-w-2xl flex flex-col gap-y-1 mt-4">
        <h3 className="text-muted-foreground font-light">About me</h3>
        <Separator />
        <div className="bg-card rounded-md border py-2 px-3 my-2">
          <p className="text-sm leading-relaxed text-wrap">
            {user.bio || "No bio"}
          </p>
        </div>
      </div>

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

function ProfilePicture({ user }: { user: User | null }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const [file, setfile] = useState<File | null>(null);
  const mutation = useMutation({
    mutationFn: ({ file }: { file: File }) => uploadProfilePic(file),
    onSuccess: () => {
      toast.success("Profile picture updated successfully");
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setUploaded(false);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setUploaded(true);
      setfile(file);
    }
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <Dialog>
        <DialogTrigger>
          <UserAvatar
            className="mx-auto border rounded-full"
            avatarUrl={user?.avatarUrl}
            size={180}
          />
        </DialogTrigger>
        <DialogContent className="bg-card p-4 flex flex-col items-center gap-4">
          <DialogTitle className="text-lg font-semibold">
            Upload profile picture
          </DialogTitle>
          <UserAvatar
            className="mx-auto border rounded-full"
            avatarUrl={user?.avatarUrl}
            size={240}
            preview={preview}
          />
          <Label
            htmlFor="uploadPfp"
            className="flex flex-row gap-2 cursor-pointer p-2 bg-primary w-fit rounded-md text-white hover:bg-primary/90 transition-colors"
          >
            <Camera />
            Upload picture
          </Label>
          <Input
            accept=".png, .jpeg, .jpg"
            type="file"
            id="uploadPfp"
            className="hidden"
            onChange={handleFileChange}
          />
          {uploaded && (
            <Button
              onClick={() => {
                if (!file) return;
                mutation.mutate({ file });
              }}
            >
              {mutation.isPending ? "Saving..." : "Save Photo"}
            </Button>
          )}
        </DialogContent>
      </Dialog>
      <h3 className="text-xl font-semibold text-center">{user?.name}</h3>
    </div>
  );
}
