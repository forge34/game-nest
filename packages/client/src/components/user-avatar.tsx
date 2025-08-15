import type { User } from "@game-forge/shared";
import { User as Avatar } from "lucide-react";

function UserAvatar({ user }: { user: User }) {
  return (
    <div className="flex items-center justify-center w-10 h-10 border rounded-full hover:bg-secondary/60 transition-colors shadow-xs">
      {user ? (
        <img src={user.avatarUrl || ""} className="rounded-full w-10 h-10" />
      ) : (
        <Avatar className="w-5 h-5" />
      )}
    </div>
  );
}

export default UserAvatar;
