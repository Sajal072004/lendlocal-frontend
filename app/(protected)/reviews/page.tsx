'use client';

import { useMyReviews } from '@/lib/hooks';
import { Review } from '@/lib/apiService';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

const ReviewCard = ({ review }: { review: Review }) => {
  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : '??';

  // Fallback for deleted items
  if (!review.item) {
    return (
      <Card className="opacity-60">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={review.reviewer.profilePicture} />
                <AvatarFallback>{getInitials(review.reviewer.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{review.reviewer.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <StarRating rating={review.rating} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            This review was for an item that has since been deleted.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Link href={`/user/${review.reviewer._id}/profile`}>
              <Avatar>
                <AvatarImage src={review.reviewer.profilePicture} />
                <AvatarFallback>{getInitials(review.reviewer.name)}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link href={`/user/${review.reviewer._id}/profile`} className="font-semibold hover:underline">
                {review.reviewer.name}
              </Link>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <StarRating rating={review.rating} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {review.comment && (
          <p className="text-muted-foreground italic border-l-2 pl-4">
            &quot;{review.comment}&quot;
          </p>
        )}
        <Link href={`/item/${review.item._id}`} className="flex items-center gap-3 p-3 rounded-md bg-muted/50 hover:bg-muted">
          <Image 
            src={review.item.photos?.[0] || '/hero-image.jpg'} 
            alt={review.item.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-md object-cover border"
          />
          <div>
            <p className="text-xs text-muted-foreground">Regarding Item</p>
            <p className="font-medium">{review.item.name}</p>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default function MyReviewsPage() {
  const { reviews, isLoading } = useMyReviews();
  
  // Filter out reviews where the item has been deleted to prevent rendering issues
  const validReviews = reviews?.filter(review => review.item);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Reviews</h1>
        <p className="text-muted-foreground mt-2">See what others have said about their borrowing experiences with you.</p>
      </div>
      
      <div className="max-w-3xl mx-auto space-y-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)
        ) : validReviews && validReviews.length > 0 ? (
          validReviews.map(review => <ReviewCard key={review._id} review={review} />)
        ) : (
          <div className="text-center py-20 bg-background rounded-lg border-2 border-dashed">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">No Reviews Yet</h3>
            <p className="text-muted-foreground mt-2">Complete a transaction to receive your first review.</p>
          </div>
        )}
      </div>
    </div>
  );
}