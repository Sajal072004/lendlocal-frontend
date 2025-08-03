'use client';

import { useParams, useRouter } from 'next/navigation';
import { useBorrowRequestDetails } from '@/lib/hooks';
import { useAuth } from '@/context/AuthContext';
import { respondToRequest } from '@/lib/apiService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Check, X, User, Calendar, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const StatusBadge = ({ status }: { status: string }) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full capitalize";
    const statusClasses = {
        pending: "bg-yellow-100 text-yellow-800",
        approved: "bg-green-100 text-green-800",
        denied: "bg-red-100 text-red-800",
        returned: "bg-blue-100 text-blue-800",
    };
    const finalClasses = `${baseClasses} ${statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'}`;
    return <div className={finalClasses}>{status}</div>;
};


export default function BorrowRequestPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const requestId = params.id as string;

  const { request, isLoading, isError, mutate } = useBorrowRequestDetails(requestId);
  
  const handleResponse = async (response: 'approved' | 'denied') => {
    try {
      await respondToRequest(requestId, response);
      toast.success(`Request has been ${response}.`);
      mutate(); // Re-fetch data to show updated status
    } catch (error) {
      toast.error("Failed to respond to request.");
    }
  };

  if (isLoading) {
    return (
        <div className="container max-w-3xl mx-auto py-8">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-96 w-full" />
        </div>
    );
  }

  if (isError || !request) {
    return (
        <div className="container max-w-3xl mx-auto py-8 text-center">
            <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-semibold">Request Not Found</h2>
            <p className="text-muted-foreground mt-2">Could not find the borrow request you&apos;re looking for.</p>
            <Button asChild className="mt-4" onClick={() => router.back()}>
                <Link href="#"><ArrowLeft className="mr-2 h-4 w-4" /> Go Back</Link>
            </Button>
        </div>
    );
  }

  const isLender = user?._id?.toString() === request.lender._id;

  return (
    <div className="container max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4 -ml-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
        </Button>

        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl">Borrow Request Details</CardTitle>
                    <StatusBadge status={request.status} />
                </div>
                <CardDescription className="flex items-center gap-2 pt-1">
                    <Calendar className="h-4 w-4" />
                    Requested on {format(new Date(request.createdAt), 'PPP')}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 p-4 border rounded-lg bg-muted/50">
                    <Image 
                        src={request.item.photos?.[0] || '/hero-image.jpg'}
                        alt={request.item.name}
                        width={128}
                        height={128}
                        className="rounded-md object-cover w-full sm:w-32 h-32 border"
                    />
                    <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Item</p>
                        <h3 className="text-xl font-semibold">{request.item.name}</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                           <CardTitle className="text-sm font-medium">Borrower</CardTitle>
                           <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Link href={`/user/${request.borrower._id}/profile`} className="flex items-center gap-3 group">
                                <Avatar>
                                    <AvatarImage src={request.borrower.profilePicture} />
                                    <AvatarFallback>{request.borrower.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <p className="font-semibold group-hover:underline">{request.borrower.name}</p>
                            </Link>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                           <CardTitle className="text-sm font-medium">Lender</CardTitle>
                           <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Link href={`/user/${request.lender._id}/profile`} className="flex items-center gap-3 group">
                                <Avatar>
                                    <AvatarImage src={request.lender.profilePicture} />
                                    <AvatarFallback>{request.lender.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <p className="font-semibold group-hover:underline">{request.lender.name}</p>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
            {isLender && request.status === 'pending' && (
                <CardFooter className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => handleResponse('denied')}>
                        <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                    <Button onClick={() => handleResponse('approved')}>
                        <Check className="mr-2 h-4 w-4" /> Approve
                    </Button>
                </CardFooter>
            )}
        </Card>
    </div>
  );
}