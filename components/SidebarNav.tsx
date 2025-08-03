'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, MessageSquare, Package, Settings, X, Star } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

// Add the new Communities link
const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/communities", icon: Users, label: "Communities" }, // <-- ADD THIS
  { href: "/chat", icon: MessageSquare, label: "Messages" },
  { href: "/profile", icon: Package, label: "My Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/reviews", icon: Star, label: "My Reviews" },
];

interface SidebarNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidebarNav({ isOpen, onClose }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-20 bg-black/60 transition-opacity sm:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Sidebar - Make wider on desktop */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 flex-col border-r bg-background transition-transform duration-300 sm:flex sm:translate-x-0 w-64", // <-- ADD w-64 for width
        isOpen ? "translate-x-0" : "-translate-x-full",
        "sm:w-64" // Keep it wide on small screens and up
      )}>
        <div className="flex items-center justify-between border-b p-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Package className="h-6 w-6" />
              <span>LendLocal</span>
            </Link>
            <Button variant="ghost" size="icon" className="sm:hidden" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
        </div>
        <nav className="flex-1 p-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname.startsWith(item.href) && "bg-muted text-primary"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}