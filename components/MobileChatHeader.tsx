'use client';

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Phone, Video, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MobileChatHeaderProps {
  conversationPartner?: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  isTyping?: boolean;
  onMenuClick: () => void;
  className?: string;
}

export function MobileChatHeader({ 
  conversationPartner, 
  isTyping, 
  onMenuClick,
  className 
}: MobileChatHeaderProps) {
  return (
    <div className={cn(
      "sticky -top-8 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b lg:hidden",
      className
    )}>
      <div className="flex items-center gap-3 p-3 sm:p-4">
        {/* Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="h-9 w-9"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open conversations</span>
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
          {/* <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => {
              console.log("the voice call clicked");
              toast.error("Voice calls are not supported yet.");
            }}
          >
            <Phone className="h-4 w-4" />
            <span className="sr-only">Voice call</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={()=> {
              toast.error("Video calls are not supported yet.");
            }}
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
          </Button> */}
        </div>
      </div>
    </div>
  );
}