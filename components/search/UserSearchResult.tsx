import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserResult {
  _id: string;
  name: string;
  profilePicture?: string;
}

export function UserSearchResult({ user }: { user: UserResult }) {
    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

  return (
    <Link href={`/user/${user._id}/profile`} className="flex items-center gap-4 p-3 -mx-3 rounded-lg hover:bg-muted transition-colors">
      <Avatar className="h-12 w-12 border">
        <AvatarImage src={user.profilePicture} />
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-muted-foreground">User</p>
      </div>
    </Link>
  );
}