'use client';

import { useParams, useRouter } from 'next/navigation'; // <-- Import useRouter
import { useUserProfile, useUserLentItems, useUserFollowers, useMyFollowing } from '@/lib/hooks';
import { useAuth } from '@/context/AuthContext';
import { followUser, unfollowUser, startConversation } from '@/lib/apiService'; // <-- Import startConversation
import { Skeleton } from '@/components/ui/skeleton';
import { ItemCard } from '@/components/ItemCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Users, Package, Calendar, MapPin, UserPlus, MessageSquare } from 'lucide-react'; // <-- Import MessageSquare
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter(); // <-- Initialize router
  const userId = params.id as string;
  const { user: currentUser } = useAuth();

  // ... (keep existing hooks and state)
  const { profile, isLoading: isLoadingProfile } = useUserProfile(userId);
  const { items, isLoading: isLoadingItems } = useUserLentItems(userId);
  const { followers, isLoading: isLoadingFollowers, mutate: mutateFollowers } = useUserFollowers(userId);
  const { isLoading: isLoadingFollowing, mutate: mutateFollowing } = useMyFollowing(currentUser?._id?.toString());
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
      // ... (keep existing handleFollow function)
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
  
  // --- ADD THIS FUNCTION ---
  const handleMessage = async () => {
    try {
      const conversation = await startConversation(userId);
      router.push(`/chat/${conversation._id}`);
    } catch (error) {
      console.error("Failed to start conversation", error);
    }
  };

  // ... (keep existing loading/error states)
  if (isLoadingProfile) {
    // ...
  }
  if (!profile) {
    return (
      <div>Profile Not found</div>
    )
  }

  return (
    <div className="bg-muted/40 min-h-screen">
       <div className="bg-background border-b">
           <div className="container mx-auto py-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                    {/* ... (keep Avatar and user info divs) */}
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
                    {/* --- UPDATE THIS SECTION --- */}
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
                    {/* --------------------------- */}
                </div>
           </div>
       </div>

      {/* ... (keep the rest of the component JSX the same) */}
      <div className="container mx-auto py-8 lg:py-12">
        {/* ... */}
      </div>
    </div>
  );
}