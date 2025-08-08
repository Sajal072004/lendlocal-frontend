'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { startConversation } from '@/lib/apiService';
import { toast } from 'sonner';
import { Loader } from '@/components/ui/loader';

export default function StartChatPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  useEffect(() => {
    const findOrCreateConversation = async () => {
      if (!userId) return;

      try {
        
        const conversation = await startConversation(userId);
        
        router.replace(`/chat/${conversation._id}`);
      } catch (error) {
        toast.error("Could not start conversation.");
        router.replace('/chat'); 
      }
    };

    findOrCreateConversation();
  }, [userId, router]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader />
      <p className="ml-4 text-muted-foreground">Starting conversation...</p>
    </div>
  );
}