'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useCommunityDetails, useCommunityItems } from '@/lib/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { ItemCard } from '@/components/ItemCard';
import { Button } from '@/components/ui/button';
import { AddItemModal } from '@/components/AddItemModal';
import { CommunitySidebar } from '@/components/CommunitySidebar';
import { InviteMemberModal } from '@/components/InviteMemberModal';
import { PlusCircle, Search, Package, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function CommunityPage() {
  const params = useParams();
  const communityId = params.id as string;

  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { community, isLoading: isLoadingDetails } = useCommunityDetails(communityId);
  const { items, isLoading: isLoadingItems, mutate: mutateItems } = useCommunityItems(communityId);

  const filteredItems = items?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoadingDetails) {
    return (
      <div className="container mx-auto py-8 lg:py-12 grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="h-10 w-full mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-xl" />)}
          </div>
        </div>
        <div className="hidden lg:block">
          <Skeleton className="h-[450px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <>
      <AddItemModal 
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        communityId={communityId}
        onItemAdded={() => mutateItems()}
      />

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        communityId={communityId}
      />

      <div className="container mx-auto py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 lg:gap-12 items-start">
          {/* Main Content: Search and Items Grid */}
          <main className="lg:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={`Search in ${community?.name}...`}
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setIsInviteModalOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Members
                </Button>
                <Button onClick={() => setIsAddItemModalOpen(true)} className="w-full md:w-auto flex-shrink-0">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Item
                </Button>
              </div>
            </div>

            {isLoadingItems ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-xl" />)}
              </div>
            ) : filteredItems?.length === 0 ? (
              <div className="text-center py-20 bg-muted rounded-lg">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold">
                  {searchTerm ? 'No items match your search' : 'No Items Yet'}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {searchTerm ? 'Try a different search term.' : 'Be the first to add an item to this community!'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems?.map(item => (
                  <ItemCard key={item._id} item={item} />
                ))}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            {community && <CommunitySidebar community={community} itemCount={items?.length || 0} onInvite={() => setIsInviteModalOpen(true)} />}
          </aside>
        </div>
      </div>
    </>
  );
}