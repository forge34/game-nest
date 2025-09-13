import UserAvatar from "./user-avatar";
import { Link } from "@tanstack/react-router";

type UserProfileLinkProps = {
  showName?: boolean;
  username: string;
  avatarUrl?: string | null;
};

function UserProfileLink({
  showName = true,
  username,
  avatarUrl,
}: UserProfileLinkProps) {
  return (
    <Link to={"/user/$username/profile"} params={{ username: username }}>
      <div className="flex flex-row gap-2">
        <UserAvatar avatarUrl={avatarUrl} />
        {showName && <h3 className="self-center">{username}</h3>}
      </div>
    </Link>
  );
}

export default UserProfileLink;
