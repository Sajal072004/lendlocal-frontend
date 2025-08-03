'use client';

import { useState } from 'react';
import { useAllCommunities, useUserCommunities } from '@/lib/hooks';
import { requestToJoinCommunity, Community } from '@/lib/apiService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Users, CheckCircle, LogIn, Clock } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const CommunityCard = ({ community, isMember, onJoinRequest }: { community: Community, isMember: boolean, onJoinRequest: (id: string) => void }) => {
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the Link from firing if the button is for an action
    if (!isMember) {
      e.preventDefault();
      onJoinRequest(community._id);
    }
  };

  return (
    <Link href={`/community/${community._id}`} className="block h-full">
      <Card className="flex flex-col h-full hover:border-primary transition-colors">
        <CardHeader>
          <CardTitle>{community.name}</CardTitle>
          <CardDescription className="line-clamp-2 h-10">{community.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            <span>{community.memberCount ? community.memberCount : 0} member(s)</span>
          </div>
        </CardContent>
        <CardFooter>
          {isMember ? (
            <Button variant="outline" className="w-full">
              View Community
            </Button>
          ) : community.hasPendingRequest ? (
            <Button disabled variant="outline" className="w-full">
              <Clock className="mr-2 h-4 w-4" />
              Request Sent
            </Button>
          ) : (
            <Button className="w-full" onClick={handleButtonClick}>
              <LogIn className="mr-2 h-4 w-4" />
              Request to Join
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default function CommunitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { allCommunities, isLoading: isLoadingAll, mutate: mutateAllCommunities } = useAllCommunities();
  const { communities: myCommunities, isLoading: isLoadingMy } = useUserCommunities();

  const handleJoinRequest = async (communityId: string) => {
    try {
      await requestToJoinCommunity(communityId);
      toast.success("Request to join sent successfully!");
      mutateAllCommunities();
    } catch (error) {
      toast.error("Failed to send request.");
    }
  };

  const myCommunityIds = new Set(myCommunities?.map(c => c._id));
  
  const filteredCommunities = allCommunities?.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLoading = isLoadingAll || isLoadingMy;

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explore Communities</h1>
          <p className="text-muted-foreground mt-2">Find and join communities to start sharing.</p>
        </div>
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search communities..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 w-full" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities?.map(community => (
            <CommunityCard 
              key={community._id}
              community={community}
              isMember={myCommunityIds.has(community._id)}
              onJoinRequest={handleJoinRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
}