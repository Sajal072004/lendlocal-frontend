'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { useSearchAll } from '@/lib/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, Package, Users, User } from 'lucide-react';
import { ItemSearchResult } from '@/components/search/ItemSearchResult';
import { CommunitySearchResult } from '@/components/search/CommunitySearchResult';
import { UserSearchResult } from '@/components/search/UserSearchResult';
import { useRouter } from 'next/navigation';

function SearchComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const { results, isLoading } = useSearchAll(initialQuery);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
  
  const items = results?.filter(r => r.type === 'item') || [];
  const communities = results?.filter(r => r.type === 'community') || [];
  const users = results?.filter(r => r.type === 'user') || [];

  return (
    <>
      <form onSubmit={handleSearch}>
        <div className="relative w-full md:max-w-xl mx-auto">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for items, communities, or people..."
            className="pl-10 text-base"
          />
        </div>
      </form>
      
      <div className="mt-8 max-w-xl mx-auto">
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        )}
        
        {!isLoading && results && results.length === 0 && initialQuery.length > 1 && (
            <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold">No results for &quot;{initialQuery}&quot;</h3>
                <p className="text-muted-foreground mt-2">Try a different search term.</p>
            </div>
        )}

        {!isLoading && results && results.length > 0 && (
          <div className="space-y-6">
            {items.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold tracking-tight mb-2 flex items-center gap-2"><Package className="h-5 w-5"/> Items</h2>
                <div className="space-y-1">
                  {items.map(result => <ItemSearchResult key={result.data._id} item={result.data} />)}
                </div>
              </section>
            )}
            {communities.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold tracking-tight mb-2 flex items-center gap-2"><Users className="h-5 w-5"/> Communities</h2>
                <div className="space-y-1">
                  {communities.map(result => <CommunitySearchResult key={result.data._id} community={result.data} />)}
                </div>
              </section>
            )}
            {users.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold tracking-tight mb-2 flex items-center gap-2"><User className="h-5 w-5"/> People</h2>
                <div className="space-y-1">
                  {users.map(result => <UserSearchResult key={result.data._id} user={result.data} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<div>Loading search...</div>}>
        <SearchComponent />
      </Suspense>
    </div>
  );
}