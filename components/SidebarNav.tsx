'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, MessageSquare, Package, Settings, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/chat", icon: MessageSquare, label: "Messages" },
  { href: "/profile", icon: Package, label: "My Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
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
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 flex-col border-r bg-background transition-transform duration-300 sm:flex sm:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <nav className="flex flex-col items-center gap-4 px-2 py-4">
          <Link
            href="/dashboard"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Package className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">LendLocal</span>
          </Link>
          
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                pathname.startsWith(item.href) && "bg-accent text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="sr-only">{item.label}</span>
            </Link>
          ))}
        </nav>
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 sm:hidden" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </aside>
    </>
  );
}