'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { resetPassword } from '@/lib/apiService';
import { toast } from 'sonner';

interface ResetPasswordForm {
  otp: string;
  newPassword: string;
}

function ResetPasswordComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const form = useForm<ResetPasswordForm>();

    const onSubmit = async (data: ResetPasswordForm) => {
        try {
            await resetPassword({ email, otp: data.otp, newPassword: data.newPassword });
            toast.success("Password reset successfully! Please log in.");
            router.push('/login');
        } catch (error) {
            toast.error( "Failed to reset password.");
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Reset Your Password</CardTitle>
                <CardDescription>Enter the 6-digit code sent to <strong>{email}</strong> and your new password.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} /> <InputOTPSlot index={1} /> <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} /> <InputOTPSlot index={4} /> <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl><Input type="password" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default function ResetPasswordPage() {
    return <Suspense fallback={<div>Loading...</div>}><ResetPasswordComponent /></Suspense>
}