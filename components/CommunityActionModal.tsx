'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createCommunity, joinCommunity } from '@/lib/apiService';


interface CreateCommunityFormValues {
  name: string;
  description: string;
}

interface JoinCommunityFormValues {
  inviteCode: string;
}

interface CommunityActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommunityAction: () => void; 
}

export function CommunityActionModal({ isOpen, onClose, onCommunityAction }: CommunityActionModalProps) {
  const [error, setError] = useState<string | null>(null);
  const createForm = useForm<CreateCommunityFormValues>();
  const joinForm = useForm<JoinCommunityFormValues>();

  const handleCreateSubmit = async (values: CreateCommunityFormValues) => {
    setError(null);
    try {
      await createCommunity(values.name, values.description);
      onCommunityAction();
      onClose();
    } catch (err: unknown) {
      
    }
  };

  const handleJoinSubmit = async (values: JoinCommunityFormValues) => {
    setError(null);
    try {
      await joinCommunity(values.inviteCode);
      onCommunityAction();
      onClose();
    } catch (err: unknown) {
      
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <Tabs defaultValue="join">
          <DialogHeader>
            <DialogTitle>Communities</DialogTitle>
            <DialogDescription>
              Join an existing community with an invite code or create a new one.
            </DialogDescription>
            <TabsList className="grid w-full grid-cols-2 mt-4">
              <TabsTrigger value="join">Join</TabsTrigger>
              <TabsTrigger value="create">Create</TabsTrigger>
            </TabsList>
          </DialogHeader>

          {/* Join Community Tab */}
          <TabsContent value="join">
            <Form {...joinForm}>
              <form onSubmit={joinForm.handleSubmit(handleJoinSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={joinForm.control}
                  name="inviteCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invite Code</FormLabel>
                      <FormControl><Input placeholder="Enter 6-character code" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={joinForm.formState.isSubmitting}>
                  {joinForm.formState.isSubmitting ? "Joining..." : "Join Community"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* Create Community Tab */}
          <TabsContent value="create">
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Community Name</FormLabel>
                      <FormControl><Input placeholder="e.g., Neighborhood Friends" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl><Textarea placeholder="What is this community about?" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={createForm.formState.isSubmitting}>
                  {createForm.formState.isSubmitting ? "Creating..." : "Create Community"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}