'use client';

import { useForm } from 'react-hook-form';
import { useAuth } from '@/context/AuthContext';
import { updateMyProfile } from '@/lib/apiService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { toast } from 'sonner'; // We'll add this for notifications

// Define the shape of our form data
interface SettingsFormValues {
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

export default function SettingsPage() {
  const { user, checkSession } = useAuth(); // Assuming checkSession can refetch user data
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<SettingsFormValues>({
    // Pre-populate the form with the user's current data
    defaultValues: {
      name: user?.name || '',
      phoneNumber: user?.phoneNumber || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        pinCode: user?.address?.pinCode || '',
      },
    },
  });
  
  // Effect to reset form when user data changes (e.g., after initial load)
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        phoneNumber: user.phoneNumber || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          pinCode: user.address?.pinCode || '',
        },
      });
    }
  }, [user, form]);

  const onSubmit = async (values: SettingsFormValues) => {
    setError(null);
    
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
      await checkSession(); // Refresh the user data in the context
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      setError("Failed to update profile. Please try again.");
      toast.error("Failed to update profile.");
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and profile information.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>This is your public information. Be mindful of what you share.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
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
                          <Input type="file" accept="image/*" {...form.register("profilePicture")} />
                        </FormControl>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl><Input placeholder="Your phone number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
                <CardDescription>Your address will not be shared publicly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField
                  control={form.control}
                  name="address.street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street</FormLabel>
                      <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <FormField control={form.control} name="address.city" render={({ field }) => (<FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                   <FormField control={form.control} name="address.state" render={({ field }) => (<FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                   <FormField control={form.control} name="address.pinCode" render={({ field }) => (<FormItem><FormLabel>PIN Code</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                 <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                 </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
