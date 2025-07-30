'use client';

import { useParams } from 'next/navigation';
import { useCommunityDetails, useCommunityItems } from '@/lib/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { ItemCard } from '@/components/ItemCard';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function CommunityPage() {
  const params = useParams();
  const communityId = params.id as string;

  const { community, isLoading: isLoadingDetails } = useCommunityDetails(communityId);
  const { items, isLoading: isLoadingItems } = useCommunityItems(communityId);

  if (isLoadingDetails) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-10 w-1/3 mb-2" />
        <Skeleton className="h-6 w-2/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-72 w-full" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{community?.name}</h1>
          <p className="text-lg text-muted-foreground mt-2">{community?.description}</p>
        </div>
        <Button className="mt-4 md:mt-0">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Item
        </Button>
      </div>

      {isLoadingItems ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-72 w-full" />)}
        </div>
      ) : items?.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No Items Yet</h2>
          <p className="text-muted-foreground mt-2">Be the first to add an item to this community!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items?.map(item => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}