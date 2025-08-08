'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCommunityInviteCode } from '@/lib/hooks';
import { Skeleton } from './ui/skeleton';
import { Check, Copy } from 'lucide-react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityId: string;
}

export function InviteMemberModal({ isOpen, onClose, communityId }: InviteMemberModalProps) {
  const { inviteCode, isLoading } = useCommunityInviteCode(communityId);
  const [hasCopied, setHasCopied] = useState(false);

  const onCopy = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000); 
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>
            Share this code with others to let them join your community.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Invite Code
            </Label>
            {isLoading ? (
                <Skeleton className="h-10 w-full" />
            ) : (
                <Input
                    id="link"
                    defaultValue={inviteCode}
                    readOnly
                />
            )}
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={onCopy} disabled={isLoading}>
            <span className="sr-only">Copy</span>
            {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}