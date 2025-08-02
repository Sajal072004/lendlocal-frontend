'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useMessages } from '@/lib/hooks';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import { sendMessage, Message } from '@/lib/apiService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendHorizonal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function ChatPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const { user } = useAuth();
  const { socket } = useSocket();

  const { messages, isLoading, mutate } = useMessages(conversationId);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (socket) {
      // Listen for incoming messages for this specific conversation
      socket.on('new_message', (message: Message) => {
        if (message.conversation === conversationId) {
          mutate((currentMessages = []) => [...currentMessages, message], false);
        }
      });

      return () => {
        socket.off('new_message');
      };
    }
  }, [socket, conversationId, mutate]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    try {
      // Optimistically update the UI
      const optimisticMessage: Message = {
        _id: Date.now().toString(),
        conversation: conversationId,
        sender: { _id: user!._id.toString(), name: user!.name, profilePicture: user!.profilePicture! },
        content: newMessage,
        createdAt: new Date().toISOString(),
      };
      mutate((currentMessages = []) => [...currentMessages, optimisticMessage], false);
      setNewMessage('');
      
      // Send message via API (which also emits socket event from backend)
      await sendMessage(conversationId, newMessage);
      
      // Revalidate to get the actual message from the server
      mutate();
    } catch (error) {
      console.error('Failed to send message:', error);
      // Revert optimistic update on error
      mutate();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {isLoading && <p>Loading messages...</p>}
        {messages?.map(msg => (
          <div
            key={msg._id}
            className={cn(
              "flex items-end gap-3 max-w-md",
              msg.sender._id === user?._id.toString() ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={msg.sender.profilePicture} />
              <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "p-3 rounded-2xl",
                msg.sender._id === user?._id.toString()
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted rounded-bl-none"
              )}
            >
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs text-right mt-1 opacity-70">
                {format(new Date(msg.createdAt), 'p')}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            autoComplete="off"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}