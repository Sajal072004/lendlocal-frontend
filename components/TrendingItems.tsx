'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import api from '@/lib/api';

interface TrendingItem {
  _id: string;
  name: string;
  category: string;
  photos: string[];
  trendScore: number;
  requestCount: number;
  availabilityStatus: 'available' | 'borrowed' | string;
}

interface TrendingResponse {
  trending: TrendingItem[];
}

interface TrendingItemsProps {
  communityId: string;
}

function AvailabilityBadge({ status }: { status: string }) {
  if (status === 'available') {
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200 border text-[10px] px-1.5 py-0">
        Available
      </Badge>
    );
  }
  return (
    <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
      Borrowed
    </Badge>
  );
}

export function TrendingItems({ communityId }: TrendingItemsProps) {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!communityId) return;

    let cancelled = false;

    (async () => {
      try {
        const response = await api.get<TrendingResponse>(`/communities/${communityId}/trending`);
        if (!cancelled) setItems(response.data.trending ?? []);
      } catch {
        // hide section on error
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [communityId]);

  if (loading) {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-36 shrink-0 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <section aria-label="Trending items" className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-base font-semibold flex items-center gap-1.5">
          <span aria-hidden="true">🔥</span>
          Trending
        </h2>
        <span className="inline-flex items-center rounded-md border border-purple-200 bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
          ML-powered
        </span>
      </div>

      <div
        className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
        role="list"
      >
        {items.map((item) => (
          <Link
            key={item._id}
            href={`/item/${item._id}`}
            role="listitem"
            className="group shrink-0 w-36 rounded-xl border bg-card shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="relative h-24 w-full bg-muted">
              <Image
                src={item.photos?.[0] || '/profile-placeholder.jpeg'}
                alt={item.name}
                fill
                sizes="144px"
                className="object-cover"
              />
            </div>
            <div className="p-2.5 space-y-1.5">
              <p className="text-xs font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {item.name}
              </p>
              <p className="text-[10px] text-muted-foreground">{item.category}</p>
              <div className="flex items-center justify-between">
                <AvailabilityBadge status={item.availabilityStatus} />
                <span className="text-[10px] text-muted-foreground">
                  {item.requestCount} req
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
