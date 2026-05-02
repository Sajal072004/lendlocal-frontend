'use client';

import { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useUserCommunities, useBorrowRequests, useConversations } from "@/lib/hooks";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { respondToRequest, BorrowRequest } from "@/lib/apiService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from 'next/image';
import Link from "next/link";
import { PlusCircle, ChevronRight, Inbox, MessageSquare, Truck } from "lucide-react";
import { CommunityActionModal } from '@/components/CommunityActionModal';
import { ConversationCard } from '@/components/ConversationCard';
import { ShieldCheck } from 'lucide-react';

function EmptyState({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

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

  
  if (!request.item) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50 opacity-70 cursor-not-allowed">
        <p className="text-sm text-muted-foreground">This request was for an item that has since been deleted.</p>
        <span className="text-sm font-medium capitalize">{request.status.replace('_', ' ')}</span>
      </div>
    );
  }

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
          <Button size="sm" variant="outline" onClick={(e) => { e.preventDefault(); handleResponse('denied'); }}>Deny</Button>
          <Button size="sm" onClick={(e) => { e.preventDefault(); handleResponse('approved'); }}>Approve</Button>
        </div>
      )}
      {request.status !== 'pending' && (
         <span className="text-sm font-medium capitalize px-3 py-1 rounded-full bg-muted text-muted-foreground">{request.status.replace('_', ' ')}</span>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { communities, isLoading: isLoadingCommunities, mutate: mutateCommunities } = useUserCommunities();
  const { requests, isLoading: isLoadingRequests, mutate: mutateRequests } = useBorrowRequests();
  const { conversations, isLoading: isLoadingConversations } = useConversations();
  
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);

  return (
    <>
      <CommunityActionModal
        isOpen={isCommunityModalOpen}
        onClose={() => setIsCommunityModalOpen(false)}
        onCommunityAction={() => mutateCommunities()}
      />

      <div className="space-y-8">
        {!user?.kycCompleted && (
          <Link href="/complete-kyc" className="flex items-center gap-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 px-4 py-3 hover:bg-blue-100 dark:hover:bg-blue-950/60 transition-colors">
            <ShieldCheck className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Complete your identity verification</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">Verified members get 3× more borrow approvals. Add Aadhaar &amp; PAN — takes 30 seconds.</p>
            </div>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 shrink-0">Verify now →</span>
          </Link>
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here&apos;s an overview of your communities and active requests.
          </p>
        </div>

        {/* Porter delivery banner */}
        <div className="rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 dark:border-orange-800 dark:from-orange-950/40 dark:to-amber-950/40 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="rounded-full bg-orange-100 dark:bg-orange-900 p-3 shrink-0">
            <Truck className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-orange-900 dark:text-orange-200 text-sm">
              Delivery via Porter — Coming Soon 🚚
            </p>
            <p className="text-xs text-orange-700 dark:text-orange-400 mt-0.5">
              Can&apos;t meet in person? We&apos;re integrating Porter for same-day doorstep delivery across your city. View details on any item page.
            </p>
          </div>
          <span className="shrink-0 text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-700">
            In Progress
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
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
                  <TabsContent value="incoming" className="mt-6 space-y-2">
                    {isLoadingRequests ? (
                      Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
                    ) : requests?.incoming.length === 0 ? (
                      <EmptyState title="No incoming requests" description="When someone requests to borrow your item, you'll see it here." />
                    ) : (
                      requests?.incoming.map(req => (
                        <Link href={`/requests/${req._id}`} key={req._id} className="block">
                          <RequestCard request={req} type="incoming" onAction={mutateRequests} />
                        </Link>
                      ))
                    )}
                  </TabsContent>
                  <TabsContent value="outgoing" className="mt-6 space-y-2">
                    {isLoadingRequests ? (
                      Array.from({ length: 1 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
                    ) : requests?.outgoing.length === 0 ? (
                      <EmptyState title="No outgoing requests" description="When you request to borrow an item, you'll see its status here." />
                    ) : (
                      requests?.outgoing.map(req => (
                        <Link href={`/requests/${req._id}`} key={req._id} className="block">
                          <RequestCard request={req} type="outgoing" onAction={mutateRequests} />
                        </Link>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

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
            
            <Card>
              <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                  <CardDescription>Your latest conversations.</CardDescription>
              </CardHeader>
              <CardContent>
                  {isLoadingConversations ? (
                       Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
                  ) : conversations && conversations.length > 0 ? (
                      <div className="space-y-2">
                          {conversations.slice(0, 3).map(convo => (
                              <ConversationCard key={convo._id} conversation={convo} />
                          ))}
                      </div>
                  ) : (
                      <div className="text-center py-6">
                          <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
                          <p className="mt-2 text-sm text-muted-foreground">No messages yet.</p>
                      </div>
                  )}
              </CardContent>
              <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                      <Link href="/chat">View All Messages</Link>
                  </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}