'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';
import api from '@/lib/api';

interface TrustScoreSignals {
  reputation: number;
  kyc: number;
  accountAge: number;
  itemsLent: number;
  borrowActivity: number;
  returnRate: number;
}

interface TrustScoreData {
  score: number;
  level: string;
  signals: TrustScoreSignals;
}

interface TrustScoreBadgeProps {
  userId: string | undefined;
}

const SIGNAL_LABELS: Record<keyof TrustScoreSignals, string> = {
  reputation: 'Reputation',
  kyc: 'KYC',
  accountAge: 'Account Age',
  itemsLent: 'Items Lent',
  borrowActivity: 'Borrow Activity',
  returnRate: 'Return Rate',
};

const SIGNAL_MAX: Record<keyof TrustScoreSignals, number> = {
  reputation: 30,
  kyc: 20,
  accountAge: 15,
  itemsLent: 15,
  borrowActivity: 10,
  returnRate: 10,
};

function getScoreColor(score: number): { ring: string; bar: string; text: string } {
  if (score <= 40) return { ring: 'stroke-red-500', bar: 'bg-red-500', text: 'text-red-500' };
  if (score <= 60) return { ring: 'stroke-amber-500', bar: 'bg-amber-500', text: 'text-amber-500' };
  if (score <= 80) return { ring: 'stroke-green-500', bar: 'bg-green-500', text: 'text-green-500' };
  return { ring: 'stroke-blue-500', bar: 'bg-blue-500', text: 'text-blue-500' };
}

function getLevelBadgeClass(level: string): string {
  const map: Record<string, string> = {
    Excellent: 'bg-blue-100 text-blue-700 border-blue-200',
    Reliable: 'bg-green-100 text-green-700 border-green-200',
    Moderate: 'bg-amber-100 text-amber-700 border-amber-200',
    Low: 'bg-red-100 text-red-700 border-red-200',
  };
  return map[level] ?? 'bg-muted text-muted-foreground';
}

export function TrustScoreBadge({ userId }: TrustScoreBadgeProps) {
  const [data, setData] = useState<TrustScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    (async () => {
      try {
        const response = await api.get<TrustScoreData>(`/users/${userId}/trust-score`);
        if (!cancelled) setData(response.data);
      } catch {
        // hide gracefully on error
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <div className="space-y-2 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const colors = getScoreColor(data.score);
  const circumference = 2 * Math.PI * 28;
  const dashOffset = circumference - (data.score / 100) * circumference;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-purple-500" />
          AI Trust Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score ring + level */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90" aria-hidden="true">
              <circle
                cx="36"
                cy="36"
                r="28"
                fill="none"
                strokeWidth="6"
                className="stroke-muted"
              />
              <circle
                cx="36"
                cy="36"
                r="28"
                fill="none"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className={colors.ring}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${colors.text}`}>
              {data.score}
            </span>
          </div>

          <div className="space-y-1.5">
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${getLevelBadgeClass(data.level)}`}
            >
              {data.level}
            </span>
            <p className="text-xs text-muted-foreground leading-snug">
              Score out of 100 across 6 signals
            </p>
          </div>
        </div>

        {/* Signal breakdown */}
        <div className="space-y-2 pt-1">
          {(Object.keys(data.signals) as Array<keyof TrustScoreSignals>).map((key) => {
            const value = data.signals[key];
            const max = SIGNAL_MAX[key];
            const pct = Math.min((value / max) * 100, 100);
            return (
              <div key={key}>
                <div className="flex justify-between text-xs text-muted-foreground mb-0.5">
                  <span>{SIGNAL_LABELS[key]}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colors.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
