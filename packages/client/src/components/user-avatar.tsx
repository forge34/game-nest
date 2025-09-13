import { cn } from "@/lib/utils";
import { User as Avatar } from "lucide-react";

interface UserAvatarProps {
  avatarUrl?: string | null;
  size?: number;
  preview?: string | null;
  className?: string;
}

function UserAvatar({
  avatarUrl,
  size = 40,
  className,
  preview,
}: UserAvatarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center border rounded-full transition-colors shadow-xs overflow-hidden",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {avatarUrl ? (
        <img
          src={preview ? preview : avatarUrl}
          alt={"User Avatar"}
          className="rounded-full object-cover w-full h-full"
        />
      ) : (
        <Avatar style={{ width: size * 0.6, height: size * 0.6 }} />
      )}
    </div>
  );
}

export default UserAvatar;
