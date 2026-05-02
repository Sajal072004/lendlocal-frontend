'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ShieldCheck, ArrowRight, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { saveKyc } from '@/lib/apiService';

type KycFormValues = {
  aadhaarNumber: string;
  panNumber: string;
};

export default function CompleteKycPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<KycFormValues>({
    defaultValues: { aadhaarNumber: '', panNumber: '' },
  });

  const onSubmit = async (values: KycFormValues) => {
    setError(null);
    try {
      await saveKyc({ aadhaarNumber: values.aadhaarNumber, panNumber: values.panNumber });
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const res = err.response as { data?: { message?: string } };
        setError(res.data?.message || 'Something went wrong.');
      } else {
        setError('Something went wrong.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900 p-3 w-fit">
            <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-xl">Verify Your Identity</CardTitle>
          <CardDescription>
            Add your Aadhaar &amp; PAN to unlock trusted lending on LendLocal. Powered by{' '}
            <span className="font-medium text-foreground">Digio KYC</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="aadhaarNumber"
                rules={{
                  required: 'Aadhaar number is required',
                  pattern: { value: /^\d{12}$/, message: 'Must be exactly 12 digits' },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aadhaar Number</FormLabel>
                    <FormControl>
                      <Input placeholder="12-digit Aadhaar number" maxLength={12} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="panNumber"
                rules={{
                  required: 'PAN number is required',
                  pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]$/i, message: 'Format: ABCDE1234F' },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PAN Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. ABCDE1234F"
                        maxLength={10}
                        {...field}
                        onChange={e => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="rounded-lg border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 px-3 py-2.5">
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Your documents are handled by Digio&apos;s RBI-compliant infrastructure. LendLocal never stores raw document data.
                </p>
              </div>

              {error && <p className="text-sm font-medium text-destructive">{error}</p>}

              <Button type="submit" className="w-full gap-2" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save & Continue'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </Form>

          <Button
            variant="ghost"
            className="w-full mt-2 text-muted-foreground gap-2"
            onClick={() => router.push('/dashboard')}
          >
            <SkipForward className="h-4 w-4" />
            Skip for now — I&apos;ll add this later in Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
