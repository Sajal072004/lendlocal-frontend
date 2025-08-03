'use client';

import { useState } from 'react';
import { useAllCommunities, useUserCommunities } from '@/lib/hooks';
import { joinCommunity, Community } from '@/lib/apiService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Users, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

const CommunityCard = ({ community, isMember, onJoin }: { community: Community, isMember: boolean, onJoin: (id: string) => void }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{community.name}</CardTitle>
        <CardDescription className="line-clamp-2">{community.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-4 w-4" />
          <span>{community.memberCount || 0} member(s)</span>
        </div>
      </CardContent>
      <CardFooter>
        {isMember ? (
          <Button disabled variant="outline" className="w-full">
            <CheckCircle className="mr-2 h-4 w-4" />
            Already a member
          </Button>
        ) : (
          <Button asChild className="w-full">
            <Link href={`/community/${community._id}`}>View Community</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default function CommunitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { allCommunities, isLoading: isLoadingAll } = useAllCommunities();
  const { communities: myCommunities, isLoading: isLoadingMy, mutate: mutateMyCommunities } = useUserCommunities();

  const handleJoin = async (communityId: string) => {
    try {
      // This is a placeholder for a future "request to join" flow.
      // For now, it will use the existing join logic if you have an invite code,
      // or you would build a request-to-join endpoint.
      // Since we don't have the invite code here, we'll simulate a toast message.
      toast.info("Request to join functionality is not yet implemented.");
      // Example of how it would work:
      // await requestToJoin(communityId);
      // toast.success("Request sent!");
      // mutateMyCommunities();
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
              onJoin={() => handleJoin(community._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}