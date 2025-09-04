import { cn } from "@/lib/utils";
import type { User } from "@game-forge/shared";
import { User as Avatar } from "lucide-react";

interface UserAvatarProps {
  user?: User | null;
  size?: number;
  preview?: string|null;
  className?: string;
}

function UserAvatar({ user, size = 40, className, preview }: UserAvatarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center border rounded-full transition-colors shadow-xs overflow-hidden",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {user?.avatarUrl ? (
        <img
          src={preview ? preview : user.avatarUrl}
          alt={user.name || "User Avatar"}
          className="rounded-full object-cover w-full h-full"
        />
      ) : (
        <Avatar style={{ width: size * 0.6, height: size * 0.6 }} />
      )}
    </div>
  );
}

export default UserAvatar;
