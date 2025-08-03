'use client';

import { IItemRequest } from '@/lib/apiService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ItemRequestCardProps {
  request: IItemRequest;
}

export function ItemRequestCard({ request }: ItemRequestCardProps) {
  const { user } = useAuth();
  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : '??';
  const isOwnRequest = user?._id === request.requestedBy._id;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{request.itemName}</CardTitle>
        <CardDescription>&quot;{request.description}&quot;</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between items-center">
        <Link href={`/user/${request.requestedBy._id}/profile`} className="flex items-center gap-2 group">
          <Avatar className="h-8 w-8">
            <AvatarImage src={request.requestedBy.profilePicture} />
            <AvatarFallback>{getInitials(request.requestedBy.name)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium group-hover:underline">{request.requestedBy.name}</span>
        </Link>
        {!isOwnRequest && (
          <Button asChild>
            {/* FIX: Point to the new redirector page with the target USER's ID */}
            <Link href={`/chat/user/${request.requestedBy._id}`}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Offer Item
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}