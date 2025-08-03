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
      <div className="flex min-h-screen w-full bg-muted/40">
        <SidebarNav isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        {/* Adjust left padding for the wider sidebar */}
        <div className="flex flex-col flex-1 sm:pl-64"> 
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 p-4 sm:p-6">
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