'use client';

import { useParams, useRouter } from 'next/navigation';
import { useUserProfile, useUserLentItems, useUserFollowers, useMyFollowing } from '@/lib/hooks';
import { useAuth } from '@/context/AuthContext';
import { followUser, unfollowUser, startConversation } from '@/lib/apiService';
import { Skeleton } from '@/components/ui/skeleton';
import { ItemCard } from '@/components/ItemCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Users, Package, Calendar, MapPin, UserPlus, MessageSquare, Repeat } from 'lucide-react'; 
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const { user: currentUser } = useAuth();

  const { profile, isLoading: isLoadingProfile } = useUserProfile(userId);
  const { items, isLoading: isLoadingItems } = useUserLentItems(userId);
  const { followers, mutate: mutateFollowers } = useUserFollowers(userId);
  const { mutate: mutateFollowing } = useMyFollowing(currentUser?._id?.toString());

  const [isFollowing, setIsFollowing] = useState(false);
  const [isSubmittingFollow, setIsSubmittingFollow] = useState(false);

  useEffect(() => {
      if (followers && currentUser) {
          setIsFollowing(followers.some(f => f.follower._id.toString() === currentUser._id?.toString()));
      }
  }, [followers, currentUser]);

  const getInitials = (name: string | undefined) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const handleFollow = async () => {
      if (!currentUser) return;
      setIsSubmittingFollow(true);
      try {
          if (isFollowing) {
              await unfollowUser(userId);
          } else {
              await followUser(userId);
          }
          mutateFollowers();
          mutateFollowing();
      } catch (error) {
          console.error("Failed to follow/unfollow user:", error);
      } finally {
          setIsSubmittingFollow(false);
      }
  };
  
  const handleMessage = async () => {
    try {
      const conversation = await startConversation(userId);
      router.push(`/chat/${conversation._id}`);
    } catch (error) {
      console.error("Failed to start conversation", error);
    }
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
    <div className="bg-muted/40 min-h-screen">
       <div className="bg-background border-b">
           <div className="container mx-auto py-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                    <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 shadow-lg">
                    <AvatarImage src={profile.profilePicture} alt={profile.name} />
                    <AvatarFallback className="text-5xl">{getInitials(profile.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow text-center md:text-left pt-4">
                        <h1 className="text-4xl font-bold tracking-tight">{profile.name}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{profile.address?.city || 'Location not set'}, {profile.address?.state}</span>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-1.5 mt-2">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">{profile.reputationScore.toFixed(1)}</span>
                            <span className="text-sm text-muted-foreground">(Reputation)</span>
                        </div>
                    </div>
                    {currentUser?._id?.toString() !== profile._id && (
                        <div className="flex items-center gap-2 mt-4 md:mt-6 w-full md:w-auto">
                            <Button onClick={handleFollow} variant={isFollowing ? 'outline' : 'default'} className="flex-1" disabled={isSubmittingFollow}>
                               {isSubmittingFollow ? '...' : isFollowing ? 'Following' : 'Follow'}
                            </Button>
                            <Button onClick={handleMessage} variant="secondary" className="flex-1">
                                <MessageSquare className="mr-2 h-4 w-4"/> Message
                            </Button>
                        </div>
                    )}
                </div>
           </div>
       </div>

      <div className="container mx-auto py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
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
          
          <aside className="space-y-8 sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About {profile.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-3" />
                  <span>Joined on {format(new Date(profile.createdAt), 'MMMM d, yyyy')}</span>
                </div>
                <div className="border-t my-4" />
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="font-bold text-lg">{profile.followerCount}</p>
                        <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                     <div>
                        <p className="font-bold text-lg">{profile.transactionCount}</p>
                        <p className="text-xs text-muted-foreground">Transactions</p>
                    </div>
                </div>
              </CardContent>
            </Card>
          </aside>

        </div>
      </div>
    </div>
  );
}