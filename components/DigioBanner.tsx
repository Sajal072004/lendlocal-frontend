'use client';

import { ShieldCheck, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface DigioBannerProps {
  variant?: 'compact' | 'full';
  kycCompleted?: boolean;
}

export function DigioBanner({ variant = 'compact', kycCompleted = false }: DigioBannerProps) {
  if (variant === 'compact') {
    return (
      <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40 px-4 py-3 flex items-start gap-3">
        <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 leading-tight">
            KYC-Verified Lending — Powered by Digio
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 leading-snug">
            LendLocal uses Aadhaar &amp; PAN verification to ensure every lender is a real, trusted person.{' '}
            <span className="font-medium">Launching soon.</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className={kycCompleted ? 'border-green-100 dark:border-green-900' : 'border-blue-100 dark:border-blue-900'}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`rounded-full p-2 ${kycCompleted ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900'}`}>
              {kycCompleted
                ? <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                : <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              }
            </div>
            <CardTitle className="text-base">Identity Verification (KYC)</CardTitle>
          </div>
          {kycCompleted ? (
            <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-0">
              Verified
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 border-0">
              Not Verified
            </Badge>
          )}
        </div>
        <CardDescription className="mt-2">
          {kycCompleted
            ? 'Your identity has been verified. You are a trusted member of LendLocal.'
            : <>Verify your identity with Aadhaar or PAN via <span className="font-medium text-foreground">Digio</span> — India&apos;s trusted digital KYC platform.</>
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border bg-muted/40 p-3 space-y-1">
            <p className="text-xs font-semibold">Aadhaar Verification</p>
            <p className="text-xs text-muted-foreground">OTP-based e-KYC via UIDAI. Confirms identity without sharing your Aadhaar number.</p>
          </div>
          <div className="rounded-lg border bg-muted/40 p-3 space-y-1">
            <p className="text-xs font-semibold">PAN Verification</p>
            <p className="text-xs text-muted-foreground">Instant PAN validation against NSDL records. Required for items valued above ₹500.</p>
          </div>
        </div>

        <div className="rounded-lg border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 px-4 py-3 flex gap-2">
          <Lock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-700 dark:text-blue-300">
            Your documents are never stored on LendLocal servers. Verification is handled entirely by Digio&apos;s secure, RBI-compliant infrastructure.
          </p>
        </div>

        {kycCompleted ? (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <p className="text-sm font-medium">Identity verified — Aadhaar &amp; PAN on file</p>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button asChild className="gap-2">
              <Link href="/complete-kyc">
                <ShieldCheck className="h-4 w-4" />
                Complete KYC Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">Integration currently in development</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
