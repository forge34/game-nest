import { queryClient } from "@/api";
import { getUserById, uploadProfilePic } from "@/api/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserAvatar from "@/components/user-avatar";
import type { User } from "@gridcollect/shared";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
// import useUser from "@/lib/hooks/use-user";
//
export const Route = createFileRoute("/user/$username")({
  component: RouteComponent,
  beforeLoad: async ({ params, context }) => {
    const data = await context.queryClient.ensureQueryData(
      getUserById(params.username),
    );

    return data;
  },
});

function RouteComponent() {
  const { username } = Route.useParams();
  const { data: user } = useQuery(getUserById(username));
  if (!user) return null;
  return (
    <div className="flex flex-col m-4 gap-4">
      <div className="flex flex-row gap-2">
        <Button asChild>
          <Link to="./profile" from={Route.path}>
            Profile
          </Link>
        </Button>
        <Button asChild>
          <Link to="./collections" from={Route.path}>
            User's Collections
          </Link>
        </Button>
      </div>

      <div className="flex flex-row gap-6 items-start self-center">
        <ProfilePicture user={user} />
      </div>

      <div className="flex gap-4">
        <div className="bg-card rounded-md border py-2 px-3 my-2 w-64 max-w-[45%] max-h-fit">
          <p className="text-sm leading-relaxed text-wrap">
            {user.bio || "No bio"}
          </p>
        </div>
        <Outlet />
      </div>
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
