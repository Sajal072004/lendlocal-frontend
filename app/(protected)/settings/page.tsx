'use client';

import { useForm, UseFormReturn } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { updateMyProfile, updateEmailNotificationPreferences, EmailNotificationPreferences } from '@/lib/apiService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect } from 'react';
import { toast } from 'sonner';

// Form values for the profile section
interface ProfileFormValues {
  name: string;
  phoneNumber?: string;
  profilePicture?: FileList;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pinCode?: string;
  };
}

// Correctly alias the type for the notification form
type NotificationFormValues = EmailNotificationPreferences;

// Helper component to avoid repeating the FormField for each switch
const NotificationSwitch = ({ form, name, label, description }: { form: UseFormReturn<NotificationFormValues>, name: keyof NotificationFormValues, label: string, description: string }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <FormLabel className="text-base">{label}</FormLabel>
          <CardDescription>{description}</CardDescription>
        </div>
        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
      </FormItem>
    )}
  />
);

export default function SettingsPage() {
  const { user, checkSession } = useAuth();
  
  // Separate forms for each card for clarity and independent submission
  const profileForm = useForm<ProfileFormValues>();
  const notificationForm = useForm<NotificationFormValues>();

  // Effect to populate forms when user data is available
  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name,
        phoneNumber: user.phoneNumber || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pinCode: user.address?.pinCode || '',
        },
      });
      // FIX: Populate notification form with email preferences
      notificationForm.reset(user.emailNotificationPreferences);
    }
  }, [user, profileForm, notificationForm]);

  const onProfileSubmit = async (values: ProfileFormValues) => {
    const formData = new FormData();
    formData.append('name', values.name);
    if(values.phoneNumber) formData.append('phoneNumber', values.phoneNumber);
    if(values.address?.street) formData.append('address[street]', values.address.street);
    if(values.address?.city) formData.append('address[city]', values.address.city);
    if(values.address?.state) formData.append('address[state]', values.address.state);
    if(values.address?.pinCode) formData.append('address[pinCode]', values.address.pinCode);
    
    if (values.profilePicture && values.profilePicture.length > 0) {
      formData.append('profilePicture', values.profilePicture[0]);
    }

    try {
      await updateMyProfile(formData);
      await checkSession();
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  const onNotificationSubmit = async (data: NotificationFormValues) => {
    try {
      await updateEmailNotificationPreferences(data);
      await checkSession();
      toast.success("Email preferences updated!");
    } catch (error) {
      toast.error("Failed to update email preferences.");
    }
  };
  
  const getInitials = (name: string | undefined) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="container mx-auto max-w-3xl py-8 lg:py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings, profile, and email preferences.
          </p>
        </div>

        {/* --- Profile Card and Form --- */}
        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>This is your public information. Be mindful of what you share.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={profileForm.control}
                  name="profilePicture"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user?.profilePicture} />
                        <AvatarFallback className="text-2xl">{getInitials(user?.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <FormLabel>Profile Picture</FormLabel>
                        <FormControl>
                          <Input type="file" accept="image/*" {...profileForm.register("profilePicture")} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField control={profileForm.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your full name" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={profileForm.control} name="phoneNumber" render={({ field }) => ( <FormItem><FormLabel>Phone Number (Optional)</FormLabel><FormControl><Input placeholder="Your phone number" {...field} /></FormControl><FormMessage /></FormItem> )} />
              </CardContent>
               <CardFooter className="border-t px-6 py-4">
                   <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                       {profileForm.formState.isSubmitting ? "Saving..." : "Save Profile"}
                   </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
        
        {/* --- Email Notifications Card and Form --- */}
        <Form {...notificationForm}>
          <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)}>
            <Card>
              <CardHeader>
                  <CardTitle>Email Notification Preferences</CardTitle>
                  <CardDescription>Choose which transactional emails you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <NotificationSwitch form={notificationForm} name="new_borrow_request" label="New Borrow Requests" description="When someone requests to borrow your item." />
                  <NotificationSwitch form={notificationForm} name="request_approved" label="Request Approved" description="When a lender approves your borrow request." />
                  <NotificationSwitch form={notificationForm} name="request_denied" label="Request Denied" description="When a lender denies your borrow request." />
                  <NotificationSwitch form={notificationForm} name="item_returned" label="Item Return Initiated" description="When a borrower marks your item as returned." />
                  <NotificationSwitch form={notificationForm} name="return_confirmed" label="Return Confirmed" description="When a lender confirms an item has been returned." />
                  <NotificationSwitch form={notificationForm} name="new_join_request" label="Community Join Requests" description="When someone wants to join a community you own." />
                  <NotificationSwitch form={notificationForm} name="new_item_request" label="Wanted Item Requests" description="When someone in your community posts a wanted item." />
                  <NotificationSwitch form={notificationForm} name="new_follower" label="New Followers" description="When another user follows you." />
                  <NotificationSwitch form={notificationForm} name="new_message" label="New Chat Messages" description="When you receive a new direct message." />
              </CardContent>
               <CardFooter className="border-t px-6 py-4">
                   <Button type="submit" disabled={notificationForm.formState.isSubmitting}>
                       {notificationForm.formState.isSubmitting ? "Saving..." : "Save Email Preferences"}
                   </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}