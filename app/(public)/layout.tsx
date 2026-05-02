'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { LandingHeader } from "@/components/LandingHeader";
import { Loader } from "@/components/ui/loader";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && isAuthenticated && pathname !== '/' && pathname !== '/complete-kyc') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  
  if (pathname === '/' || pathname === '/complete-kyc' || !isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <LandingHeader />
        {/* This main section will now correctly center the login/register cards */}
        <main className="flex-1 flex items-center justify-center bg-muted/40 p-4 md:p-8">
          {children}
        </main>
      </div>
    );
  }

  
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1 flex items-center justify-center">
        <Loader />
      </main>
    </div>
  );
}