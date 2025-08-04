'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Loader } from "@/components/ui/loader";
import { SidebarNav } from "@/components/SidebarNav";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex h-screen w-full bg-muted/40 overflow-hidden">
        <SidebarNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        {/* Main content area with fixed header */}
        <div className="flex flex-col flex-1 sm:pl-64 h-full">
          {/* Fixed Header */}
          <div className="flex-shrink-0 z-10">
            <Header onMenuClick={() => setIsSidebarOpen(true)} />
          </div>
          
          {/* Scrollable Main Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Loader />
    </div>
  );
}