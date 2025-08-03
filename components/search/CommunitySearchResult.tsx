import { Community } from "@/lib/apiService";
import Link from "next/link";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Users } from "lucide-react";

export function CommunitySearchResult({ community }: { community: Community }) {
  return (
    <Link href={`/community/${community._id}`} className="flex items-center gap-4 p-3 -mx-3 rounded-lg hover:bg-muted transition-colors">
      <Avatar className="h-12 w-12 border bg-background">
        <AvatarFallback><Users className="h-6 w-6 text-muted-foreground" /></AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-semibold">{community.name}</p>
        <p className="text-sm text-muted-foreground">Community</p>
      </div>
    </Link>
  );
}