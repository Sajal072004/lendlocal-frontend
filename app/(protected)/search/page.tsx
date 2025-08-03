'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useSearchAll, useAllCommunities, useAllItems, useAllUsers } from '@/lib/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, Package, Users, User, Compass, X } from 'lucide-react';
import { ItemSearchResult } from '@/components/search/ItemSearchResult';
import { CommunitySearchResult } from '@/components/search/CommunitySearchResult';
import { UserSearchResult } from '@/components/search/UserSearchResult';
import { Community, Item } from '@/lib/apiService';
import { IUser } from '@/lib/types';

function SearchComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  // Hooks for fetching data
  const { results: searchResults, isLoading: isSearching } = useSearchAll(initialQuery);
  const { allCommunities, isLoading: isLoadingCommunities } = useAllCommunities();
  const { allItems, isLoading: isLoadingItems } = useAllItems();
  const { allUsers, isLoading: isLoadingUsers } = useAllUsers();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    router.push('/search');
  };
  
  const items = searchResults?.filter(r => r.type === 'item') || [];
  const communities = searchResults?.filter(r => r.type === 'community') || [];
  const users = searchResults?.filter(r => r.type === 'user') || [];

  const showSearchResults = initialQuery.length > 0;
  const isLoading = isSearching || isLoadingCommunities || isLoadingItems || isLoadingUsers;

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:max-w-xl mx-auto">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for items, communities, or people..."
            className="pl-10 text-base"
          />
          {query && (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button type="submit">Search</Button>
      </form>
      
      <div className="mt-8">
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2"> {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)} </div>
            <div className="space-y-2"> {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)} </div>
            <div className="space-y-2"> {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)} </div>
          </div>
        )}
        
        {showSearchResults && !isSearching && (
          <div className="max-w-xl mx-auto">
            {searchResults && searchResults.length === 0 ? (
              <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-xl font-semibold">No results for &quot;{initialQuery}&quot;</h3>
                  <p className="text-muted-foreground mt-2">Try a different search term.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {items.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold mb-2 flex items-center gap-2"><Package className="h-5 w-5"/> Items</h2>
                    {items.map(result => <ItemSearchResult key={`item-${result.data._id}`} item={result.data as Item} />)}
                  </section>
                )}
                {communities.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold mb-2 flex items-center gap-2"><Users className="h-5 w-5"/> Communities</h2>
                    {communities.map(result => <CommunitySearchResult key={`comm-${result.data._id}`} community={result.data as Community} />)}
                  </section>
                )}
                {users.length > 0 && (
                  <section>
                    <h2 className="text-lg font-semibold mb-2 flex items-center gap-2"><User className="h-5 w-5"/> People</h2>
                    {users.map(result => <UserSearchResult key={`user-${result.data._id}`} user={{...result.data as IUser, _id: String(result.data._id)}} />)}
                  </section>
                )}
              </div>
            )}
          </div>
        )}

        {!showSearchResults && !isLoading && (
          <div className="space-y-8">
            <div className="text-center">
              <Compass className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-2xl font-bold">Explore</h2>
              <p className="text-muted-foreground">Discover items, communities, and people.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <section>
                <h2 className="text-lg font-semibold mb-4">Recently Added Items</h2>
                <div className="space-y-2">
                  {allItems?.slice(0, 5).map(item => <ItemSearchResult key={`all-item-${item._id}`} item={item as Item} />)}
                </div>
              </section>
              <section>
                <h2 className="text-lg font-semibold mb-4">Popular Communities</h2>
                <div className="space-y-2">
                  {allCommunities?.slice(0, 5).map(community => <CommunitySearchResult key={`all-comm-${community._id}`} community={community as Community} />)}
                </div>
              </section>
              <section>
                <h2 className="text-lg font-semibold mb-4">Discover People</h2>
                <div className="space-y-2">
                  {allUsers?.slice(0, 5).map(user => <UserSearchResult key={`all-user-${user._id}`} user={{...user, _id: String(user._id)}} />)}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchComponent />
    </Suspense>
  );
}