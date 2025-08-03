'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Loader } from "@/components/ui/loader"; // Import the loader

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    // Use the animated loader for a better experience
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-muted/40">
        <Header />
        {/* Use 'flex-1' to make the main content area take up remaining space */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  // This loader will show briefly during the redirect to the login page
  return (
    <div className="flex items-center justify-center h-screen">
        <Loader />
    </div>
  );
}