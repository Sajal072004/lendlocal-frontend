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
import { MobileChatHeader } from '@/components/MobileChatHeader';
import { SendHorizonal, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function ChatPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const { user } = useAuth();
  const { socket } = useSocket();

  const { messages, isLoading, mutate } = useMessages(conversationId);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      setIsTyping(true);
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
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  // Get conversation partner info
  const conversationPartner = messages?.find(msg => msg.sender._id !== user?._id.toString())?.sender;

  // Handle back navigation
  const handleBackClick = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  // Handle mobile sidebar toggle (this will be passed from layout)
  const handleSidebarToggle = () => {
    // This function will be provided by the parent layout
    // For now, we'll use a custom event to communicate with the layout
    window.dispatchEvent(new CustomEvent('toggleSidebar'));
  };

  return (
    <div className="flex flex-col h-full bg-background w-full">
      {/* Mobile Header */}
      <MobileChatHeader 
        conversationPartner={conversationPartner}
        isTyping={isTyping}
        onMenuClick={handleSidebarToggle}
      />
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b lg:block hidden">
          <div className="flex items-center gap-3 p-3 sm:p-4">
            {/* Back Button for Desktop */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={handleBackClick}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            
            {/* Contact Info */}
            {conversationPartner && (
              <>
                <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                  <AvatarImage src={conversationPartner.profilePicture} />
                  <AvatarFallback className="text-sm">
                    {conversationPartner.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h1 className="font-semibold text-sm sm:text-base truncate">
                    {conversationPartner.name}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {isTyping ? 'typing...' : 'online'}
                  </p>
                </div>
              </>
            )}
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
              >
                <Phone className="h-4 w-4" />
                <span className="sr-only">Voice call</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
              >
                <Video className="h-4 w-4" />
                <span className="sr-only">Video call</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 pb-safe">
            {isLoading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent" />
              </div>
            )}
            
            {messages?.map((msg, index) => {
              const isCurrentUser = msg.sender._id === user?._id.toString();
              const prevMessage = messages[index - 1];
              const showAvatar = !prevMessage || prevMessage.sender._id !== msg.sender._id;
              const isLastFromSender = !messages[index + 1] || messages[index + 1].sender._id !== msg.sender._id;
              
              return (
                <div
                  key={msg._id}
                  className={cn(
                    "flex gap-2 sm:gap-3",
                    isCurrentUser ? "justify-end" : "justify-start"
                  )}
                >
                  {/* Avatar for received messages */}
                  {!isCurrentUser && (
                    <div className="flex-shrink-0">
                      {showAvatar ? (
                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                          <AvatarImage src={msg.sender.profilePicture} />
                          <AvatarFallback className="text-xs">
                            {msg.sender.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-7 w-7 sm:h-8 sm:w-8" />
                      )}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      "flex flex-col max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg",
                      isCurrentUser ? "items-end" : "items-start"
                    )}
                  >
                    {/* Sender name for group chats */}
                    {!isCurrentUser && showAvatar && (
                      <span className="text-xs text-muted-foreground mb-1 px-1">
                        {msg.sender.name}
                      </span>
                    )}
                    
                    <div
                      className={cn(
                        "px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl break-words",
                        isCurrentUser
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted rounded-bl-md",
                        // Adjust border radius for message chains
                        !showAvatar && !isCurrentUser && "rounded-tl-2xl",
                        !isLastFromSender && !isCurrentUser && "rounded-bl-2xl",
                        !showAvatar && isCurrentUser && "rounded-tr-2xl",
                        !isLastFromSender && isCurrentUser && "rounded-br-2xl"
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                    
                    {/* Timestamp */}
                    {isLastFromSender && (
                      <span className="text-xs text-muted-foreground mt-1 px-1">
                        {format(new Date(msg.createdAt), 'p')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="sticky -bottom-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-3 sm:p-4 lg:p-6 pb-safe">
          <form onSubmit={handleSendMessage} className="flex items-end gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                autoComplete="off"
                className="pr-12 py-2.5 sm:py-3 rounded-full border-2 resize-none min-h-[44px]"
                style={{ minHeight: '44px' }}
              />
            </div>
            
            <Button 
              type="submit" 
              size="icon" 
              disabled={!newMessage.trim() || isTyping}
              className="h-11 w-11 sm:h-12 sm:w-12 rounded-full flex-shrink-0"
            >
              {isTyping ? (
                <div className="animate-spin h-4 w-4 border-2 border-primary-foreground rounded-full border-t-transparent" />
              ) : (
                <SendHorizonal className="h-5 w-5" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
    </div>
  );
}