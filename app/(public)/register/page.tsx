'use client';

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { ShieldCheck, Lock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import api from "@/lib/api";

type RegisterFormValues = {
  name: string;
  username: string;
  email: string;
  password: string;
  aadhaarNumber?: string;
  panNumber?: string;
};

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { register } = useAuth();
  const router = useRouter();

  const checkUsername = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value || value.length < 3) { setUsernameStatus('idle'); return; }
    if (!/^[a-z0-9_]{3,20}$/.test(value)) { setUsernameStatus('invalid'); return; }
    setUsernameStatus('checking');
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`/auth/check-username?username=${value}`);
        setUsernameStatus(res.data.available ? 'available' : 'taken');
      } catch {
        setUsernameStatus('idle');
      }
    }, 500);
  };

  const form = useForm<RegisterFormValues>({
    defaultValues: { name: "", username: "", email: "", password: "", aadhaarNumber: "", panNumber: "" },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setError(null);
    setSuccess(null);
    try {
      const response = await register(values);
      setSuccess(response.message || "OTP sent to your email. Please verify.");
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`);
      }, 2000);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const response = err.response as { data?: { message?: string } };
        setError(response.data?.message || "An unexpected error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>Join LendLocal and start sharing with your community.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Basic info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Full Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                rules={{
                  required: 'Username is required',
                  pattern: { value: /^[a-z0-9_]{3,20}$/, message: 'Must be 3-20 characters: letters, numbers, underscores only' },
                  validate: () => usernameStatus === 'taken' ? 'Username is already taken' : true,
                }}
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="your_handle"
                          {...field}
                          onChange={e => {
                            const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                            field.onChange(val);
                            checkUsername(val);
                          }}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {usernameStatus === 'checking' && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                          {usernameStatus === 'available' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          {usernameStatus === 'taken' && <XCircle className="h-4 w-4 text-destructive" />}
                        </div>
                      </div>
                    </FormControl>
                    {usernameStatus === 'available' && <p className="text-xs text-green-600">Username is available</p>}
                    {usernameStatus === 'taken' && <p className="text-xs text-destructive">Username is already taken</p>}
                    {usernameStatus === 'idle' && <p className="text-xs text-muted-foreground">Letters, numbers and underscores only</p>}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input placeholder="m@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl><Input type="password" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* KYC Section */}
            <div className="rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Identity Verification</p>
                </div>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">Optional</span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Verified members get 3× more borrow approvals. Powered by <span className="font-semibold">Digio KYC</span>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="aadhaarNumber"
                  rules={{ pattern: { value: /^\d{12}$/, message: 'Must be exactly 12 digits' } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Aadhaar Number</FormLabel>
                      <FormControl>
                        <Input placeholder="12-digit number" maxLength={12} className="bg-white dark:bg-background" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="panNumber"
                  rules={{ pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]$/i, message: 'Format: ABCDE1234F' } }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">PAN Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ABCDE1234F"
                          maxLength={10}
                          className="bg-white dark:bg-background"
                          {...field}
                          onChange={e => field.onChange(e.target.value.toUpperCase())}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-blue-400 shrink-0" />
                <p className="text-xs text-blue-500 dark:text-blue-400">Secured by Digio — never stored on LendLocal servers</p>
              </div>
            </div>

            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            {success && <p className="text-sm font-medium text-green-600">{success}</p>}
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <GoogleAuthButton />

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline font-medium">Sign in</Link>
        </p>
      </CardContent>
    </Card>
  );
}
