'use client';

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Link from "next/link";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { ShieldCheck, Truck, Star } from "lucide-react";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const form = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    try {
      await login(values);
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
    <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
      {/* Left: Trust panel — hidden on mobile */}
      <div className="hidden lg:flex flex-col gap-6 pr-8 border-r">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back to LendLocal</h2>
          <p className="text-muted-foreground mt-1 text-sm">The community lending platform built on trust.</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-xl border bg-blue-50 dark:bg-blue-950/40 p-4">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2 shrink-0">
              <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold">KYC Verified Members</p>
              <p className="text-xs text-muted-foreground mt-0.5">Aadhaar & PAN verification via Digio ensures every person is real and accountable.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border bg-orange-50 dark:bg-orange-950/40 p-4">
            <div className="rounded-full bg-orange-100 dark:bg-orange-900 p-2 shrink-0">
              <Truck className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-semibold">Doorstep Delivery via Porter</p>
              <p className="text-xs text-muted-foreground mt-0.5">Same-day delivery coming soon — borrow without leaving home.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border bg-muted/40 p-4">
            <div className="rounded-full bg-muted p-2 shrink-0">
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-semibold">Community Trust Score</p>
              <p className="text-xs text-muted-foreground mt-0.5">Every member has a dynamic trust rating built from real lending history.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Login form */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Enter your email below to login to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
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
              {error && <p className="text-sm font-medium text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <GoogleAuthButton />

          <div className="mt-4 space-y-2 text-center text-sm">
            <p>Don&apos;t have an account?{" "}<Link href="/register" className="underline font-medium">Sign up</Link></p>
            <p><Link href="/forgot-password" className="underline text-muted-foreground hover:text-primary text-xs">Forgot your password?</Link></p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-blue-500" />
            <span>KYC-secured by Digio · Delivery by Porter</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
