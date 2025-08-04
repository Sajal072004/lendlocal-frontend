'use client';

import { ConversationList } from "@/components/ConversationList";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // Check if we're in a specific chat (has an ID in the path)
  const isInChat = pathname.includes('/chat/') && pathname.split('/').length > 2;

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    const handleToggleSidebar = () => {
      setIsSidebarOpen(true);
    };

    document.addEventListener('keydown', handleEscape);
    window.addEventListener('toggleSidebar', handleToggleSidebar);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('toggleSidebar', handleToggleSidebar);
    };
  }, []);

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Chat Layout Container - fits within main layout */}
      <div className="h-full flex bg-background rounded-lg border overflow-hidden">
        {/* Desktop Sidebar - Always visible on large screens */}
        <aside className="hidden lg:flex w-80 xl:w-96 border-r bg-background">
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Messages</h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <ConversationList />
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar - Slides in from left */}
        <div className={cn(
          "fixed top-0 left-0 h-full w-80 bg-background border-r z-50 transform transition-transform duration-300 ease-in-out lg:hidden",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* Mobile Sidebar Header */}
          <div className="p-4 border-b bg-background">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Messages</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Conversation List */}
          <div className="flex-1 overflow-hidden">
            <ConversationList />
          </div>
        </div>

        {/* Main Chat Content */}
        <main className="flex-1 flex flex-col min-w-0">
          {children}
        </main>
      </div>
    </>
  );
}