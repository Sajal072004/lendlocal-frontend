'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/Header"; // We will create this next

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and not authenticated, redirect to login page
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // While loading, we can show a spinner or a blank page
  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading skeleton component
  }

  // If authenticated, render the layout with the header and content
  if (isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 md:p-8 bg-gray-50">{children}</main>
      </div>
    );
  }

  // Return null or a loading indicator while the redirect is happening
  return null;
}