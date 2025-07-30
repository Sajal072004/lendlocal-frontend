'use client';

import { useParams } from 'next/navigation';
import { useUserProfile, useUserLentItems, useUserFollowers } from '@/lib/hooks';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { ItemCard } from '@/components/ItemCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Users, Package, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const { user: currentUser } = useAuth();

  const { profile, isLoading: isLoadingProfile } = useUserProfile(userId);
  const { items, isLoading: isLoadingItems } = useUserLentItems(userId);
  const { followers, isLoading: isLoadingFollowers } = useUserFollowers(userId);

  const getInitials = (name: string | undefined) => {
    if (!name) return '';
    if(name === undefined) return '';
    const names = name?.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  if (isLoadingProfile) {
    return (
      <div className="container mx-auto py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Skeleton className="h-8 w-1/2 mb-8" />
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
            </div>
          </div>
          <div className="hidden lg:block">
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-20">User not found.</div>;
  }

  return (
    <div className="bg-muted/40">
      <div className="container mx-auto py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          
          {/* Main Content: User's Items */}
          <main className="lg:col-span-2">
            <h2 className="text-2xl font-bold tracking-tight mb-6">{profile.name}&apos;s Items for Loan</h2>
            {isLoadingItems ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)}
              </div>
            ) : items?.length === 0 ? (
              <div className="text-center py-20 bg-background rounded-lg border-2 border-dashed">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold">No Items Listed</h3>
                <p className="text-muted-foreground mt-2">{profile.name} hasn&apos;t listed any items yet.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {items?.map(item => <ItemCard key={item._id} item={item} />)}
              </div>
            )}
          </main>

          {/* Sidebar: Profile Info */}
          <aside className="space-y-8 sticky top-24">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4 border-4 border-background shadow-md">
                    <AvatarImage src={profile.profilePicture} alt={profile.name} />
                    <AvatarFallback className="text-3xl">{getInitials(profile.name)}</AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{profile.reputationScore.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">(Reputation)</span>
                  </div>
                  {currentUser?._id !== profile._id && (
                    <Button className="mt-4 w-full">Follow</Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4" /> Followers</span>
                  <span className="font-semibold">{isLoadingFollowers ? '...' : followers?.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2"><Package className="h-4 w-4" /> Items Lent</span>
                  <span className="font-semibold">{isLoadingItems ? '...' : items?.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> Joined</span>
                  <span className="font-semibold">{format(new Date(profile.createdAt), 'MMM yyyy')}</span>
                </div>
              </CardContent>
            </Card>
          </aside>

        </div>
      </div>
    </div>
  );
}
