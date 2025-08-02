'use client';

import { useConversations } from "@/lib/hooks";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";

export function ConversationList() {
  const { conversations, isLoading } = useConversations();
  const { user } = useAuth();
  const params = useParams();
  const conversationId = params.conversationId;

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold tracking-tight">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-2 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : conversations && conversations.length > 0 ? (
          <nav className="p-2">
            {conversations.map(convo => {
              const otherParticipant = convo.participants.find(p => p._id?.toString() !== user?._id?.toString());
              if (!otherParticipant) return null;

              return (
                <Link
                  href={`/chat/${convo._id}`}
                  key={convo._id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors",
                    conversationId === convo._id && "bg-muted"
                  )}
                >
                  <Avatar>
                    <AvatarImage src={otherParticipant.profilePicture} />
                    <AvatarFallback>{getInitials(otherParticipant.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold truncate">{otherParticipant.name}</p>
                      {convo.lastMessage && (
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(convo.lastMessage.createdAt), { addSuffix: true })}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {convo.lastMessage ? convo.lastMessage.content : "No messages yet"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </nav>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <MessageSquare className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No conversations started.</p>
          </div>
        )}
      </div>
    </div>
  );
}