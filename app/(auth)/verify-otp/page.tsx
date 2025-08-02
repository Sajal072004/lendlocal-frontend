'use client';

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, Suspense } from "react"; // Import Suspense
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

type OtpFormValues = {
  otp: string;
};

// This new component contains the actual form logic and uses the client-side hooks.
function VerifyOtpForm() {
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const { verifyOtp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      setEmail(decodeURIComponent(emailFromUrl));
    } else {
      // If no email is in the URL, redirect to register
      router.push('/register');
    }
  }, [searchParams, router]);

  const form = useForm<OtpFormValues>({
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (values: OtpFormValues) => {
    setError(null);
    if (!email) {
        setError("Email not found. Please try registering again.");
        return;
    }
    try {
      await verifyOtp({ email, otp: values.otp });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const response = err.response as { data?: { message?: string } };
        setError(response.data?.message || "An unexpected error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  // Display a loading state until the email is read from the URL
  if (!email) {
     return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="flex flex-col items-center space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-12 w-48" />
                </div>
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
     );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Verify Your Account</CardTitle>
        <CardDescription>
          We sent a 6-digit code to <strong>{email}</strong>. Please enter it below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center">
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Verifying..." : "Verify"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// The main export is now a wrapper that provides the Suspense boundary.
export default function VerifyOtpPage() {
    return (
        <Suspense fallback={
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex flex-col items-center space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-12 w-48" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        }>
            <VerifyOtpForm />
        </Suspense>
    );
}