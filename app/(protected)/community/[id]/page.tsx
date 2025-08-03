'use client';

import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCommunityDetails, useCommunityItems, useCommunityJoinRequests } from '@/lib/hooks';
import { requestToJoinCommunity, respondToJoinRequest, JoinRequest as IJoinRequest } from '@/lib/apiService';
import { Skeleton } from '@/components/ui/skeleton';
import { ItemCard } from '@/components/ItemCard';
import { Button } from '@/components/ui/button';
import { AddItemModal } from '@/components/AddItemModal';
import { CommunitySidebar } from '@/components/CommunitySidebar';
import { InviteMemberModal } from '@/components/InviteMemberModal';
import { PlusCircle, Search, Package, UserPlus, LogIn, Check, X, Users, Info } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from 'next/link';

const JoinRequestCard = ({ request, onRespond }: { request: IJoinRequest, onRespond: (id: string, response: 'approve' | 'reject') => void }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
        <Link href={`/user/${request.user._id}/profile`} className="flex items-center gap-3 group">
            <Avatar>
                <AvatarImage src={request.user.profilePicture} />
                <AvatarFallback>{request.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="font-semibold group-hover:underline">{request.user.name}</p>
        </Link>
        <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onRespond(request._id, 'reject')}><X className="h-4 w-4 mr-2"/> Reject</Button>
            <Button size="sm" onClick={() => onRespond(request._id, 'approve')}><Check className="h-4 w-4 mr-2"/> Approve</Button>
        </div>
    </div>
);

export default function CommunityPage() {
  const params = useParams();
  const { user } = useAuth();
  const communityId = params.id as string;

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { community, isLoading: isLoadingDetails, mutate: mutateDetails } = useCommunityDetails(communityId);
  const { items, isLoading: isLoadingItems, mutate: mutateItems } = useCommunityItems(communityId);
  const { joinRequests, isLoading: isLoadingRequests, mutate: mutateRequests } = useCommunityJoinRequests(communityId);

  const isMember = community?.isMember;
  const isOwner = useMemo(() => community?.owner === user?._id, [community, user]);
  const hasPendingRequest = community?.hasPendingRequest;

  const handleRequestJoin = async () => {
    try {
      await requestToJoinCommunity(communityId);
      toast.success('Your request to join has been sent.');
      mutateDetails(); 
    } catch (error) {
        toast.error('Failed to send request.');
    }
  };

  const handleRespondRequest = async (requestId: string, response: 'approve' | 'reject') => {
    try {
        await respondToJoinRequest(requestId, response);
        toast.success(`Request has been ${response}d.`);
        mutateRequests(); 
        mutateDetails();
    } catch (error) {
        toast.error("Failed to respond to request.");
    }
  };

  const filteredItems = items?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (isLoadingDetails) {
    return (
        <div className="container mx-auto py-8">
            <div className="grid lg:grid-cols-[1fr_350px] gap-8">
                <div>
                    <Skeleton className="h-12 w-full mb-8" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72" />)}
                    </div>
                </div>
                <div className="hidden lg:block">
                    <Skeleton className="h-[500px]" />
                </div>
            </div>
        </div>
    )
  }
  
  if (!isMember) {
    return (
        <div className="container mx-auto py-20 text-center">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>{community?.name}</CardTitle>
                    <CardDescription>{community?.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">{community?.members.length} members</p>
                </CardContent>
                <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={handleRequestJoin} 
                      disabled={hasPendingRequest}
                    >
                        {hasPendingRequest ? (
                            <><Check className="mr-2 h-4 w-4" /> Request Sent</>
                        ) : (
                            <><LogIn className="mr-2 h-4 w-4" /> Request to Join</>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
  }

  return (
    <>
      <AddItemModal isOpen={isAddItemModalOpen} onClose={() => setIsAddItemModalOpen(false)} communityId={communityId} onItemAdded={mutateItems} />
      <InviteMemberModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} communityId={communityId} />

      <div className="grid lg:grid-cols-[1fr_380px] lg:gap-8">
          <main className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={`Search in ${community?.name}...`} className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button variant="outline" className="flex-1" onClick={() => setIsInviteModalOpen(true)}><UserPlus className="mr-2 h-4 w-4" /> Invite</Button>
                <Button onClick={() => setIsAddItemModalOpen(true)} className="flex-1"><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button>
              </div>
            </div>

            <Tabs defaultValue="items">
              <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-[auto_auto]">
                <TabsTrigger value="items">Community Items</TabsTrigger>
                {isOwner && <TabsTrigger value="requests">Join Requests <Badge className="ml-2 hidden sm:inline-flex">{joinRequests?.length || 0}</Badge></TabsTrigger>}
              </TabsList>
              <TabsContent value="items" className="mt-6">
                {isLoadingItems ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 w-full" />)}
                    </div>
                ) : filteredItems && filteredItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredItems.map(item => <ItemCard key={item._id} item={item} />)}
                  </div>
                ) : (
                    <div className="text-center py-20 bg-muted rounded-lg">
                        <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h2 className="mt-4 text-xl font-semibold">
                            {searchTerm ? 'No items match your search' : 'No Items Yet'}
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            {searchTerm ? 'Try a different search term.' : 'Be the first to add an item to this community!'}
                        </p>
                    </div>
                )}
              </TabsContent>
              {isOwner && (
                <TabsContent value="requests" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Membership Requests</CardTitle>
                            <CardDescription>Review and approve new members for your community.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoadingRequests ? <p>Loading requests...</p> : joinRequests && joinRequests.length > 0 ? (
                                joinRequests.map(req => <JoinRequestCard key={req._id} request={req} onRespond={handleRespondRequest} />)
                            ) : (
                                <p className="text-muted-foreground text-center py-4">No pending join requests.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
              )}
            </Tabs>
          </main>
          
          <aside className="hidden lg:block">
            {community && <CommunitySidebar community={community} itemCount={items?.length || 0} onInvite={() => setIsInviteModalOpen(true)} />}
          </aside>
      </div>

      <div className="lg:hidden fixed bottom-6 right-6 z-20">
          <Sheet>
              <SheetTrigger asChild>
                  <Button size="icon" className="rounded-full shadow-lg h-14 w-14">
                      <Info className="h-6 w-6" />
                  </Button>
              </SheetTrigger>
              <SheetContent>
                  {community && <CommunitySidebar community={community} itemCount={items?.length || 0} onInvite={() => setIsInviteModalOpen(true)} />}
              </SheetContent>
          </Sheet>
      </div>
    </>
  );
}