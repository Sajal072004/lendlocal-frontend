'use client';

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Conversation } from "@/lib/apiService";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface ConversationCardProps {
  conversation: Conversation;
}

export function ConversationCard({ conversation }: ConversationCardProps) {
  const { user } = useAuth();

  const otherParticipant = conversation.participants.find(p => p._id !== user?._id?.toString());

  if (!otherParticipant) {
    return null; 
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Link href={`/chat/${conversation._id}`} className="block p-3 -mx-3 rounded-lg hover:bg-muted transition-colors">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={otherParticipant.profilePicture} alt={otherParticipant.name} />
          <AvatarFallback>{getInitials(otherParticipant.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="font-semibold truncate">{otherParticipant.name}</p>
            {conversation.lastMessage && (
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
              </p>
            )}
          </div>
          <p className={cn(
            "text-sm text-muted-foreground truncate",
            
          )}>
            {conversation.lastMessage ? conversation.lastMessage.content : "No messages yet"}
          </p>
        </div>
      </div>
    </Link>
  );
}