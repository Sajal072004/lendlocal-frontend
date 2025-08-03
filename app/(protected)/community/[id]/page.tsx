'use client';

import { useParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCommunityDetails, useCommunityItems, useCommunityJoinRequests, useItemRequests, useBorrowRequests } from '@/lib/hooks';
import { requestToJoinCommunity, respondToJoinRequest, createItemRequest, createBorrowRequest, JoinRequest as IJoinRequest, IItemRequest } from '@/lib/apiService';
import { Skeleton } from '@/components/ui/skeleton';
import { ItemCard } from '@/components/ItemCard';
import { Button } from '@/components/ui/button';
import { AddItemModal } from '@/components/AddItemModal';
import { CommunitySidebar } from '@/components/CommunitySidebar';
import { InviteMemberModal } from '@/components/InviteMemberModal';
import { RequestItemModal } from '@/components/RequestItemModal';
import { ItemRequestCard } from '@/components/ItemRequestCard';
import { PlusCircle, Search, Package, UserPlus, LogIn, Check, X, Users, Info, Handshake } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from 'next/link';

// --- Sub-component for Join Requests ---
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

// --- Main Community Page Component ---
export default function CommunityPage() {
  const params = useParams();
  const { user } = useAuth();
  const communityId = params.id as string;

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // --- Data Fetching Hooks ---
  const { community, isLoading: isLoadingDetails, mutate: mutateDetails } = useCommunityDetails(communityId);
  const { items, isLoading: isLoadingItems, mutate: mutateItems } = useCommunityItems(communityId);
  const { joinRequests, isLoading: isLoadingRequests, mutate: mutateRequests } = useCommunityJoinRequests(communityId);
  const { itemRequests, isLoading: isLoadingItemRequests, mutate: mutateItemRequests } = useItemRequests(communityId);
  const { requests: borrowRequests, mutate: mutateBorrowRequests } = useBorrowRequests();

  // --- Memoized Derived State ---
  const isMember = community?.isMember;
  const isOwner = useMemo(() => community?.owner === user?._id, [community, user]);
  const hasPendingRequest = community?.hasPendingRequest;
  const requestedItemIds = useMemo(() => {
    if (!borrowRequests?.outgoing) return new Set();
    return new Set(
      borrowRequests.outgoing
        .filter(req => req.status === 'pending' || req.status === 'approved')
        .map(req => req.item._id)
    );
  }, [borrowRequests]);
  
  const filteredItems = items?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Action Handlers ---
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

  const handleCreateItemRequest = async (values: { itemName: string, description: string }) => {
    try {
      await createItemRequest(communityId, values.itemName, values.description);
      toast.success("Your item request has been posted!");
      mutateItemRequests();
      setIsRequestModalOpen(false);
    } catch (error) {
      toast.error("Failed to post item request.");
    }
  };
  
  const handleBorrowRequest = async (itemId: string) => {
    try {
      await createBorrowRequest(itemId);
      toast.success("Borrow request sent successfully!");
      mutateBorrowRequests();
    } catch (error) {
      toast.error("Failed to send borrow request.");
    }
  };

  // --- Render Logic ---
  if (isLoadingDetails) {
    return (
        <div className="container mx-auto py-8">
            <div className="grid lg:grid-cols-[1fr_350px] gap-8">
                <div><Skeleton className="h-12 w-full mb-8" /></div>
            </div>
        </div>
    );
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
      <RequestItemModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} onSubmit={handleCreateItemRequest} />

      <div className="grid lg:grid-cols-[1fr_380px] lg:gap-8">
          <main className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={`Search in ${community?.name}...`} className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button variant="outline" className="flex-1" onClick={() => setIsRequestModalOpen(true)}><Handshake className="mr-2 h-4 w-4" /> Request</Button>
                <Button variant="outline" className="flex-1" onClick={() => setIsInviteModalOpen(true)}><UserPlus className="mr-2 h-4 w-4" /> Invite</Button>
                <Button onClick={() => setIsAddItemModalOpen(true)} className="flex-1"><PlusCircle className="mr-2 h-4 w-4" /> Add Item</Button>
              </div>
            </div>

            <Tabs defaultValue="items">
              <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:grid-cols-[auto_auto_auto]">
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="wanted">Wanted</TabsTrigger>
                {isOwner && <TabsTrigger value="requests">Join Requests</TabsTrigger>}
              </TabsList>

              <TabsContent value="items" className="mt-6">
                {isLoadingItems ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 w-full" />)}
                    </div>
                ) : filteredItems && filteredItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredItems.map(item => (
                      <ItemCard 
                        key={item._id} 
                        item={item}
                      />
                    ))}
                  </div>
                ) : (
                    <div className="text-center py-20 bg-muted rounded-lg">{/* Empty state */}</div>
                )}
              </TabsContent>

              <TabsContent value="wanted" className="mt-6">
                <div className="space-y-4">
                  {isLoadingItemRequests ? <p>Loading...</p> : 
                   itemRequests && itemRequests.length > 0 ? (
                    itemRequests.map(req => <ItemRequestCard key={req._id} request={req} />)
                   ) : (
                    <div className="text-center py-20 bg-muted rounded-lg">{/* Empty state */}</div>
                   )
                  }
                </div>
              </TabsContent>

              {isOwner && (
                <TabsContent value="requests" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Membership Requests</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoadingRequests ? <p>Loading...</p> : joinRequests && joinRequests.length > 0 ? (
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
        {/* Mobile sheet */}
      </div>
    </>
  );
}