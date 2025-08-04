'use client';

import { MessageCircle, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatRootPage() {
  // Handle mobile sidebar toggle
  const handleSidebarToggle = () => {
    window.dispatchEvent(new CustomEvent('toggleSidebar'));
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center p-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSidebarToggle}
            className="h-9 w-9"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open conversations</span>
          </Button>
          <h1 className="ml-3 text-lg font-semibold">Messages</h1>
        </div>
      </div>

      {/* Welcome Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/50">
        <MessageCircle className="h-16 w-16 text-muted-foreground" />
        <h2 className="mt-6 text-2xl font-semibold">Welcome to your Inbox</h2>
        <p className="mt-2 text-muted-foreground">Select a conversation to start chatting.</p>
      </div>
    </div>
  );
}