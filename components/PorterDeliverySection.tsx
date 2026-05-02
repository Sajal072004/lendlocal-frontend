'use client';

import { Truck, MapPin, Package, Clock, ChevronRight, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const steps = [
  {
    icon: Package,
    title: 'Request Pickup',
    description: 'Borrower places delivery request. Porter agent is dispatched to the lender\'s location.',
  },
  {
    icon: Truck,
    title: 'Secure Transit',
    description: 'Item is picked up, sealed, and tracked live via Porter\'s delivery network.',
  },
  {
    icon: MapPin,
    title: 'Doorstep Delivery',
    description: 'Item delivered to borrower. Both parties confirm handover inside the app.',
  },
];

export function PorterDeliverySection() {
  return (
    <Card className="border-orange-100 dark:border-orange-900 mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-orange-100 dark:bg-orange-900 p-2">
              <Truck className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-base">Ship this Item via Porter</CardTitle>
              <CardDescription className="mt-0.5 text-xs">
                Can&apos;t meet in person? Get the item delivered to your doorstep.
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 border-0 shrink-0">
            In Progress
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* How it works */}
        <div className="space-y-3">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="rounded-full border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/40 p-1.5">
                  <step.icon className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-4 bg-orange-100 dark:bg-orange-900 mt-1" />
                )}
              </div>
              <div className="pb-1">
                <p className="text-xs font-semibold">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Estimates */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border bg-muted/40 p-2.5">
            <p className="text-sm font-bold">₹60–₹120</p>
            <p className="text-xs text-muted-foreground mt-0.5">Est. delivery fee</p>
          </div>
          <div className="rounded-lg border bg-muted/40 p-2.5">
            <Clock className="h-4 w-4 mx-auto text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">Same-day within city</p>
          </div>
          <div className="rounded-lg border bg-muted/40 p-2.5">
            <p className="text-sm font-bold">Live</p>
            <p className="text-xs text-muted-foreground mt-0.5">GPS tracking</p>
          </div>
        </div>

        {/* Note */}
        <div className="flex gap-2 rounded-lg border border-orange-100 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/40 px-3 py-2.5">
          <Info className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400 mt-0.5 shrink-0" />
          <p className="text-xs text-orange-700 dark:text-orange-300">
            Porter integration is currently being set up. Delivery fees are paid by the borrower. Lenders earn goodwill points for enabling delivery.
          </p>
        </div>

        <Button disabled className="w-full gap-2 opacity-60 cursor-not-allowed">
          <Truck className="h-4 w-4" />
          Schedule Pickup with Porter
          <ChevronRight className="h-4 w-4 ml-auto" />
        </Button>
      </CardContent>
    </Card>
  );
}
