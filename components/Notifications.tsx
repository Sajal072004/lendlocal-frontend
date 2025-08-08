'use client';

import { useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useNotifications } from '@/lib/hooks';
import { markNotificationAsRead, Notification } from '@/lib/apiService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Bell, Circle } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function Notifications() {
  const { socket } = useSocket();
  const { notifications, mutate } = useNotifications();
  const router = useRouter();

  useEffect(() => {
    if (socket) {
      socket.on('new_notification', (notification: Notification) => {
        
        mutate((currentNotifications = []) => [notification, ...currentNotifications], false);
        
        toast.info(notification.message);
      });

      return () => {
        socket.off('new_notification');
      };
    }
  }, [socket, mutate]);
  
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await markNotificationAsRead(notification._id);
        mutate(); 
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
    router.push(notification.link);
  };

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-primary-foreground text-xs items-center justify-center">
                {unreadCount}
              </span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications && notifications.length > 0 ? (
          notifications.slice(0, 5).map(notification => (
            <DropdownMenuItem
              key={notification._id}
              className="flex items-start gap-3 p-2 cursor-pointer"
              onClick={() => handleNotificationClick(notification)}
            >
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src={notification.sender.profilePicture} />
                <AvatarFallback>{notification.sender.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>
              </div>
              {!notification.isRead && (
                <Circle className="h-2 w-2 fill-primary text-primary self-center" />
              )}
            </DropdownMenuItem>
          ))
        ) : (
          <p className="p-4 text-sm text-center text-muted-foreground">No new notifications</p>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}