'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCommunityDetails } from '@/lib/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const MemberCard = ({ member }: { member: { _id: string; name: string; profilePicture?: string } }) => {
  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <Link href={`/user/${member._id}/profile`} className="flex items-center gap-4 group">
        <Avatar>
          <AvatarImage src={member.profilePicture} />
          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold group-hover:underline">{member.name}</p>
        </div>
      </Link>
      <Button asChild variant="outline" size="sm">
        <Link href={`/user/${member._id}/profile`}>View Profile</Link>
      </Button>
    </div>
  );
};

export default function CommunityMembersPage() {
  const params = useParams();
  const router = useRouter();
  const communityId = params.id as string;

  const { community, isLoading } = useCommunityDetails(communityId);

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Community
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>
            {isLoading ? <Skeleton className="h-8 w-48" /> : `${community?.name} Members`}
          </CardTitle>
          <CardDescription>
            All members in the community.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : community && community.members.length > 0 ? (
            community.members.map(member => <MemberCard key={member._id} member={member} />)
          ) : (
            <p className="text-muted-foreground text-center py-8">This community has no members yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}