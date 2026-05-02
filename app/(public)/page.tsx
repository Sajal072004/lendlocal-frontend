import { Button } from "@/components/ui/button";
import { Share2, Users, ShieldCheck, ArrowRight, Truck, MapPin, Package, Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-20 lg:py-32 xl:py-40 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Borrow, Don&apos;t Buy.
                <br />
                <span className="text-primary">Share with Your Community.</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                LendLocal connects you with your neighbors to borrow items you need and lend out things you&apos;re not using. Save money, reduce waste, and build a stronger community.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/register">Get Started for Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              </div>
            </div>
            <Image
              src="/hero-image.jpg"
              width={600}
              height={400}
              alt="Hero Image"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-20 lg:py-28">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why You&apos;ll Love LendLocal</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We&apos;ve built a platform that makes sharing simple, safe, and rewarding.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
            <div className="grid gap-1 text-center">
              <Share2 className="h-10 w-10 mx-auto text-primary" />
              <h3 className="text-xl font-bold">Share Anything</h3>
              <p className="text-muted-foreground">From power tools to party supplies, easily list your items for others to borrow.</p>
            </div>
            <div className="grid gap-1 text-center">
              <Users className="h-10 w-10 mx-auto text-primary" />
              <h3 className="text-xl font-bold">Build Community</h3>
              <p className="text-muted-foreground">Create or join private communities with people you trust, like neighbors or colleagues.</p>
            </div>
            <div className="grid gap-1 text-center">
              <ShieldCheck className="h-10 w-10 mx-auto text-primary" />
              <h3 className="text-xl font-bold">Safe & Secure</h3>
              <p className="text-muted-foreground">With user reviews and a robust reporting system, you can share with confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Digio KYC Trust Section */}
      <section className="w-full py-20 lg:py-28 bg-blue-50 dark:bg-blue-950/20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center max-w-5xl mx-auto">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900 px-4 py-1.5">
                <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Powered by Digio KYC</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Lend to People You Can <span className="text-blue-600 dark:text-blue-400">Actually Trust</span>
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Every lender on LendLocal is verified using Aadhaar & PAN through Digio — India&apos;s RBI-compliant digital KYC platform. No fakes, no fraud.
              </p>
              <ul className="space-y-3">
                {[
                  'Aadhaar OTP e-KYC via UIDAI — instant identity confirmation',
                  'PAN validation against NSDL records — required for high-value items',
                  'Documents never stored on our servers — handled by Digio',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-3 rounded-lg border border-blue-100 dark:border-blue-900 bg-white dark:bg-blue-950/40 px-4 py-3">
                <Lock className="h-4 w-4 text-blue-500 shrink-0" />
                <p className="text-xs text-muted-foreground">KYC verification is launching soon. Sign up now to get early verified status.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border bg-white dark:bg-muted/20 p-6 space-y-3 shadow-sm">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 w-fit">
                  <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold">Aadhaar Verified</h4>
                <p className="text-sm text-muted-foreground">Real identity confirmed via UIDAI OTP. Zero manual review needed.</p>
              </div>
              <div className="rounded-2xl border bg-white dark:bg-muted/20 p-6 space-y-3 shadow-sm">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 w-fit">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold">PAN Validated</h4>
                <p className="text-sm text-muted-foreground">NSDL-backed PAN check for high-value lending. Instant results.</p>
              </div>
              <div className="rounded-2xl border bg-blue-600 dark:bg-blue-700 p-6 space-y-3 shadow-sm col-span-2">
                <p className="text-sm font-medium text-white">
                  &quot;Verified users get 3× more borrow approvals than unverified ones. Build trust from day one.&quot;
                </p>
                <p className="text-xs text-blue-200">— LendLocal Trust System</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-20 lg:py-28 bg-muted/40">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How It Works in 3 Easy Steps</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Getting started with LendLocal is simple and intuitive.
            </p>
          </div>
          <div className="mx-auto w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold">Find an Item</h3>
              <p className="text-muted-foreground">Search for an item you need in your local community.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold">Request to Borrow</h3>
              <p className="text-muted-foreground">Send a request to the owner and coordinate a pickup time.</p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold">Share & Return</h3>
              <p className="text-muted-foreground">Use the item, return it on time, and leave a review!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Porter Delivery Section */}
      <section className="w-full py-20 lg:py-28">
        <div className="container px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-100 dark:bg-orange-900 px-4 py-1.5">
                <Truck className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Coming Soon — Porter Integration</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Can&apos;t Meet in Person? <span className="text-orange-600 dark:text-orange-400">We&apos;ll Deliver It.</span>
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-lg">
                LendLocal is integrating Porter for same-day doorstep delivery across your city — so distance is never a reason to miss out on borrowing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { icon: Package, title: 'Request Pickup', desc: 'Place a delivery request. A Porter agent is dispatched to the lender within minutes.' },
                { icon: Truck, title: 'Secure Transit', desc: 'Item is sealed, tracked live, and handled with care throughout transit.' },
                { icon: MapPin, title: 'Doorstep Delivery', desc: 'Item arrives at your door. Both parties confirm handover inside the app.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-2xl border bg-orange-50/50 dark:bg-orange-950/20 p-6 space-y-3 text-center">
                  <div className="rounded-full bg-orange-100 dark:bg-orange-900 p-3 w-fit mx-auto">
                    <Icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h4 className="font-semibold">{title}</h4>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/40 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold text-lg">Pan-India Lending — No Distance Limit</h4>
                <p className="text-sm text-muted-foreground">
                  Borrowers pay the shipping fee (est. ₹60–₹120 same-city). Lenders earn goodwill points. Live GPS tracking for every delivery.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <div className="rounded-xl border border-orange-200 dark:border-orange-800 bg-white dark:bg-orange-950/40 px-4 py-3 text-center">
                  <p className="text-xl font-bold text-orange-600">₹60–120</p>
                  <p className="text-xs text-muted-foreground">Est. delivery fee</p>
                </div>
                <div className="rounded-xl border border-orange-200 dark:border-orange-800 bg-white dark:bg-orange-950/40 px-4 py-3 text-center">
                  <p className="text-xl font-bold text-orange-600">Same Day</p>
                  <p className="text-xs text-muted-foreground">Within city</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Start Sharing?</h2>
          <p className="mx-auto max-w-[500px] text-primary-foreground/80 md:text-lg">
            Join thousands of people already saving money and building community with LendLocal.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/register">Create Your Free Account <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 px-4 md:px-6 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">&copy; 2024 LendLocal. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">Built by Sajal Namdeo</p>
        </div>
      </footer>
    </div>
  );
}
