'use client';

import { useState } from 'react'; // Import useState
import { useAuth } from "@/context/AuthContext";
import { useUserCommunities, useBorrowRequests } from "@/lib/hooks";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { respondToRequest, BorrowRequest } from "@/lib/apiService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from 'next/image';
import Link from "next/link";
import { PlusCircle, ChevronRight, Inbox } from "lucide-react";
import { CommunityActionModal } from '@/components/CommunityActionModal'; // <-- Import the new modal

// --- A more visually appealing empty state component ---
function EmptyState({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

// --- Request Card Component ---
function RequestCard({ request, type, onAction }: { request: BorrowRequest, type: 'incoming' | 'outgoing', onAction: () => void }) {
  const userToShow = type === 'incoming' ? request.borrower : request.lender;

  const handleResponse = async (response: 'approved' | 'denied') => {
    try {
      await respondToRequest(request._id, response);
      onAction();
    } catch (error) {
      console.error("Failed to respond to request:", error);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
      <div className="flex items-center gap-4">
        <Image 
          src={request.item.photos?.[0] || '/hero-image.jpg'} 
          alt={request.item.name} 
          width={64} 
          height={64} 
          className="rounded-md object-cover h-16 w-16 border"
        />
        <div>
          <p className="font-semibold">{request.item.name}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Avatar className="h-5 w-5">
              <AvatarImage src={userToShow.profilePicture} alt={userToShow.name} />
              <AvatarFallback>{userToShow.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{userToShow.name}</span>
          </div>
        </div>
      </div>
      {type === 'incoming' && request.status === 'pending' && (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleResponse('denied')}>Deny</Button>
          <Button size="sm" onClick={() => handleResponse('approved')}>Approve</Button>
        </div>
      )}
      {request.status !== 'pending' && (
         <span className="text-sm font-medium capitalize px-3 py-1 rounded-full bg-muted text-muted-foreground">{request.status}</span>
      )}
    </div>
  );
}

// --- Main Dashboard Page Component ---
export default function DashboardPage() {
  const { user } = useAuth();
  const { communities, isLoading: isLoadingCommunities, mutate: mutateCommunities } = useUserCommunities(); // Get mutate
  const { requests, isLoading: isLoadingRequests, mutate: mutateRequests } = useBorrowRequests();
  
  // State to control the modal
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);

  return (
    <>
      <CommunityActionModal
        isOpen={isCommunityModalOpen}
        onClose={() => setIsCommunityModalOpen(false)}
        onCommunityAction={() => mutateCommunities()} // Refresh list on action
      />

      <div className="container mx-auto py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground mt-2">
              Here&apos;s an overview of your communities and active requests.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Requests */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Borrow Requests</CardTitle>
                  <CardDescription>Manage your incoming and outgoing item requests.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="incoming">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="incoming">Incoming</TabsTrigger>
                      <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
                    </TabsList>
                    <TabsContent value="incoming" className="mt-6 space-y-4">
                      {isLoadingRequests ? (
                        Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
                      ) : requests?.incoming.length === 0 ? (
                        <EmptyState title="No incoming requests" description="When someone requests to borrow your item, you'll see it here." />
                      ) : (
                        requests?.incoming.map(req => <RequestCard key={req._id} request={req} type="incoming" onAction={mutateRequests} />)
                      )}
                    </TabsContent>
                    <TabsContent value="outgoing" className="mt-6 space-y-4">
                      {isLoadingRequests ? (
                        Array.from({ length: 1 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
                      ) : requests?.outgoing.length === 0 ? (
                        <EmptyState title="No outgoing requests" description="When you request to borrow an item, you'll see its status here." />
                      ) : (
                        requests?.outgoing.map(req => <RequestCard key={req._id} request={req} type="outgoing" onAction={mutateRequests} />)
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Communities */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Your Communities</CardTitle>
                  <CardDescription>Communities you are a member of.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isLoadingCommunities ? (
                    Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
                  ) : communities?.length === 0 ? (
                    <EmptyState title="No communities yet" description="Join or create a community to start sharing." />
                  ) : (
                    communities?.map(community => (
                      <Link href={`/community/${community._id}`} key={community._id} className="block p-4 border rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{community.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{community.description}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </Link>
                    ))
                  )}
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={() => setIsCommunityModalOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Create or Join
                    </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
