'use client';

import { useAuth } from '@/context/AuthContext';
import { useMyFollowing } from '@/lib/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';


interface FollowingUser {
    _id: string;
    name: string;
    profilePicture?: string;
}


interface FollowingResponse {
    _id: string;
    following: FollowingUser; 
}

const UserCard = ({ user }: { user: FollowingUser }) => {
  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <Link href={`/user/${user._id}/profile`} className="flex items-center gap-4 group">
        <Avatar>
          <AvatarImage src={user.profilePicture} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold group-hover:underline">{user.name}</p>
        </div>
      </Link>
      <Button asChild variant="outline" size="sm">
        <Link href={`/user/${user._id}/profile`}>View Profile</Link>
      </Button>
    </div>
  );
};


export default function FollowingPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  
  const { following, isLoading } = useMyFollowing(user?._id?.toString());

  return (
    <div className="container mx-auto max-w-2xl py-8">
       <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Profile
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Following</CardTitle>
          <CardDescription>Users you are following.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
             Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : following && following.length > 0 ? (
            
            (following as unknown as FollowingResponse[]).map((f) => {
              if (!f.following) return null; 
              return <UserCard key={f._id} user={f.following} />;
            })
          ) : (
            <p className="text-muted-foreground text-center py-8">You are not following anyone yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}