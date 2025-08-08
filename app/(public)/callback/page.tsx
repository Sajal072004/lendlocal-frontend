'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function AuthCallback() {
  const { handleAuthCallback } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      handleAuthCallback(token);
    } else {
      
      router.push('/login');
    }
  }, [searchParams, handleAuthCallback, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Please wait while we sign you in...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthCallback />
        </Suspense>
    )
}