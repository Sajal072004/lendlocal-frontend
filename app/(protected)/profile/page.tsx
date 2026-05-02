'use client';

import { useAuth } from '@/context/AuthContext';
import { useMyBorrowingHistory, useMyLendingHistory, useMyFollowers, useMyFollowing } from '@/lib/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ItemCard } from '@/components/ItemCard';
import { Star, Users, UserPlus, Package, Settings, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { TrustScoreBadge } from '@/components/TrustScoreBadge';


interface Request {
    _id: string;
    item: {
        name: string;
        photos?: string[];
    };
    lender: {
        name: string;
    };
    status: string;
}

function HistoryCard({ request }: { request: Request }) {
    return (
        <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
                <img src={request.item.photos?.[0] || 'https://placehold.co/64x64/e2e8f0/64748b?text=Item'} alt={request.item.name} className="h-16 w-16 rounded-md object-cover" />
                <div>
                    <p className="font-semibold">{request.item.name}</p>
                    <p className="text-sm text-muted-foreground">Lent by {request.lender.name}</p>
                </div>
            </div>
            <span className="text-sm font-medium capitalize px-3 py-1 rounded-full bg-muted text-muted-foreground">{request.status}</span>
        </div>
    );
}

export default function MyProfilePage() {
  const { user } = useAuth();
  const { items, isLoading: isLoadingItems } = useMyLendingHistory();
  const { history, isLoading: isLoadingHistory } = useMyBorrowingHistory();
  const { followers, isLoading: isLoadingFollowers } = useMyFollowers(user?._id?.toString());
  const { following, isLoading: isLoadingFollowing } = useMyFollowing(user?._id?.toString());

  const getInitials = (name: string | undefined) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };
  
  if (!user) {
      return <div>Loading profile...</div>; 
  }

  return (
    <div className="container mx-auto py-8 lg:py-12">
      {!user.kycCompleted && (
        <Link href="/complete-kyc" className="mb-6 flex items-center gap-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 px-4 py-3 hover:bg-blue-100 dark:hover:bg-blue-950/60 transition-colors">
          <ShieldCheck className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Identity not verified</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">Add your Aadhaar &amp; PAN to get a verified badge and unlock higher trust with lenders.</p>
          </div>
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 shrink-0">Verify now →</span>
        </Link>
      )}
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 mb-12">
        <Avatar className="h-28 w-28 border-4">
          <AvatarImage src={user.profilePicture} alt={user.name} />
          <AvatarFallback className="text-4xl">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight">{user.name}</h1>
          <p className="text-muted-foreground mt-1">{user.email}</p>
          {user.username && <p className="text-sm font-mono text-muted-foreground">@{user.username}</p>}
          <div className="flex items-center justify-center md:justify-start gap-6 mt-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{user.reputationScore?.toFixed(1) || 'N/A'}</span>
            </div>
            <Link href="/profile/followers" className="flex items-center gap-1.5 hover:underline">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{followers?.length || 0}</span> Followers
            </Link>
            <Link href="/profile/following" className="flex items-center gap-1.5 hover:underline">
              <UserPlus className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{following?.length || 0}</span> Following
            </Link>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" /> Edit Profile
          </Link>
        </Button>
      </div>

      {/* Trust Score */}
      <div className="mb-8">
        <TrustScoreBadge userId={user._id?.toString()} />
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="my-items">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-2">
          <TabsTrigger value="my-items">My Items</TabsTrigger>
          <TabsTrigger value="borrow-history">Borrow History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-items" className="mt-6">
          {isLoadingItems ? <p>Loading items...</p> : items?.length === 0 ? (
            <p>You haven&apos;t listed any items yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items?.map(item => <ItemCard key={item._id} item={item} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="borrow-history" className="mt-6 space-y-4">
           {isLoadingHistory ? <p>Loading history...</p> : history?.length === 0 ? (
            <p>You haven&apos;t borrowed any items yet.</p>
           ) : (
             history?.map(req => <HistoryCard key={req._id} request={req} />)
           )}
        </TabsContent>
      </Tabs>
    </div>
  );
}