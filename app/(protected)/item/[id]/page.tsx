'use client';

import { useParams, useRouter } from 'next/navigation';
import { useItemDetails } from '@/lib/hooks';
import { useAuth } from '@/context/AuthContext';
import { createBorrowRequest } from '@/lib/apiService';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, User, Calendar, CheckCircle, XCircle } from 'lucide-react';

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const itemId = params.id as string;

  const { item, isLoading, isError } = useItemDetails(itemId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRequestBorrow = async () => {
    setIsSubmitting(true);
    setRequestStatus(null);
    setErrorMessage('');
    try {
      await createBorrowRequest(itemId);
      setRequestStatus('success');
    } catch (err: unknown) {
      setRequestStatus('error');
      if (err && typeof err === 'object' && 'response' in err) {
        const response = err.response as { data?: { message?: string } };
        setErrorMessage(response.data?.message || "An unexpected error occurred.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-5xl py-8">
        <Skeleton className="h-8 w-48 mb-12" />
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="w-full aspect-square rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">Item Not Found</h2>
        <p className="text-muted-foreground mt-2">We couldn&apos;t find the item you&apos;re looking for.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }
  
  const isOwner = user?._id === item.owner._id;

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to items
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div>
          <Image
            src={item.photos?.[0] || '/profile-placeholder.jpeg'}
            alt={item.name}
            width={600}
            height={600}
            className="w-full aspect-square object-cover rounded-lg border"
          />
          {/* Add thumbnails for multiple images here if needed */}
        </div>

        {/* Item Details */}
        <div className="flex flex-col space-y-6">
          <div>
            <Badge variant={item.availabilityStatus === 'available' ? 'default' : 'destructive'} className="mb-2">
              {item.availabilityStatus.charAt(0).toUpperCase() + item.availabilityStatus.slice(1)}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight">{item.name}</h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Owner Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={`/user/${item.owner._id}`} className="flex items-center gap-3 group">
                <Avatar>
                  <AvatarImage src={item.owner.profilePicture} />
                  <AvatarFallback>{item.owner.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-semibold group-hover:underline">{item.owner.name}</span>
              </Link>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{item.description}</p>
          </div>
          
          {/* Action Button */}
          <div className="pt-4">
            {isOwner ? (
              <Button disabled className="w-full">This is your item</Button>
            ) : item.availabilityStatus === 'borrowed' ? (
              <Button disabled className="w-full">Currently Borrowed</Button>
            ) : (
              <Button onClick={handleRequestBorrow} disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Sending Request...' : 'Request to Borrow'}
              </Button>
            )}
          </div>
          
          {/* Success/Error Messages */}
          {requestStatus === 'success' && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <p>Request sent successfully! The owner has been notified.</p>
            </div>
          )}
          {requestStatus === 'error' && (
             <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}