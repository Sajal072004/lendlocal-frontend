'use client';

import { CommunityDetails } from "@/lib/apiService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Package, UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

interface CommunitySidebarProps {
  community: CommunityDetails;
  itemCount: number;
  onInvite: () => void; // Add this prop to handle the invite button click
}

export function CommunitySidebar({ community, itemCount, onInvite }: CommunitySidebarProps) {
  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>{community.name}</CardTitle>
        <CardDescription>{community.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <Users className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="font-semibold">{community.members.length}</p>
            <p className="text-xs text-muted-foreground">Members</p>
          </div>
          <div className="space-y-1">
            <Package className="mx-auto h-6 w-6 text-muted-foreground" />
            <p className="font-semibold">{itemCount}</p>
            <p className="text-xs text-muted-foreground">Items</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Members</h4>
          <div className="space-y-3">
            {community.members.slice(0, 5).map(member => (
              <Link href={`/user/${member._id}/profile`} key={member._id} className="flex items-center gap-3 group">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={member.profilePicture} alt={member.name} />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium group-hover:underline">{member.name}</span>
              </Link>
            ))}
            {community.members.length > 5 && (
              <Button variant="link" asChild className="p-0 h-auto text-sm">
                <Link href={`/community/${community._id}/members`}>View all members</Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      {/* Add the CardFooter with the Invite button */}
      <CardFooter>
        <Button className="w-full" variant="outline" onClick={onInvite}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite to Community
        </Button>
      </CardFooter>
    </Card>
  );
}